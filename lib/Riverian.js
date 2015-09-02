'use strict';
// Utilities
const dotenv = require('dotenv');
const path = require('path');
const _ = require('lodash');
const winston = require('winston');
const Promise = require('bluebird');

// Koa specific dependencies
const _koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const session = require('koa-session-redis');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const flash = require('koa-flash');

// Templating
const swig = require('swig');
const swigExtras = require('swig-extras');

// Database modules
const Waterline = require('waterline');
const mysqlAdapter = require('sails-mysql');

// Utility for extending errors
class ExtendableError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}

class RiverianError extends ExtendableError {
    constructor(message) {
        super(message);
    }
}


//
// Protected properties
//
var __environment = null;
var __root = null;
var __ctx = null;

// These are set up by waterline in setupDatabase
var __waterlineInstances = null;
var __connections = null;

const __configuration   = {};
const __modelObjects    = {};
const __waterlineModels = {};
const __coreModules     = {};

const waterline = new Waterline();

/**
 * **Riverian** Class
 */
class Riverian {
    constructor(root) {
        __root = root;

        const consoleTransport = new(winston.transports.Console)({
            colorize: true,
            level: 'debug',
            prettyPrint: true,
            silent: false
        });

        this.logger = new(winston.Logger)({
            transports: [consoleTransport]
        });

        const koa = _koa();
        this.koa = koa;
    }

    /** @type {string} */
    get environment() {
        return __environment;
    }
    /** @type {string} */
    get root() {
        return __root;
    }
    /** @type {object} */
    get configuration() {
        return __configuration;
    }
    /** @type {object} */
    get models() {
        return __waterlineInstances;
    }

    loadApplicationConfig() {
        const cfg = require(path.join(this.root, '/config/default.js'))();
        this.logger.debug("Loaded default configuration", cfg);
        return cfg;
    }

    loadEnvironmentConfig() {
        try {
            const cfg = require(path.join(this.root, '/config/environments/' + this.environment))();
            this.logger.debug("Loaded " + this.environment + " configuration", cfg);
            return cfg;
        } catch (e) {
            this.logger.info("No environment specific configuration found in /config/environments");
        }
    }

    extendConfiguration(obj) {
        return _.extend(__configuration, obj);
    }

    setup(ctx) {
        __ctx = ctx;
        dotenv.load();
        __environment = process.env.NODE_ENV;

        if (!this.environment) {
            this.logger.error("You need to set NODE_ENV in your .env file.");
            process.exit(0);
        }

        // Load the configuration files
        const applicationConfig = this.loadApplicationConfig();
        const environmentConfig = this.loadEnvironmentConfig();
        const configuration = _.merge(applicationConfig, environmentConfig);


        /*         
            Environment specific configuration overwrites application wide configuration.
            The more secret configuration options can be set in the .env file
            
            The following options CAN and SHOULD be set in the .env file
            
            MYSQL_HOST
            MYSQL_USER
            MYSQL_PASS
            MYSQL_DB
            COOKIE_SECRET
        */
        configuration.database = configuration.databse ||  {
            mysql: {
                host: null,
                user: null,
                pass: null
            }
        }

        if (process.env.MYSQL_HOST)
            configuration.database.mysql.host = process.env.MYSQL_HOST;
        if (process.env.MYSQL_USER)
            configuration.database.mysql.user = process.env.MYSQL_USER;
        if (process.env.MYSQL_PASS)
            configuration.database.mysql.pass = process.env.MYSQL_PASS;
        if (process.env.MYSQL_DB)
            configuration.database.mysql.db = process.env.MYSQL_DB;
        if (process.env.COOKIE_SECRET)
            configuration.cookie_secret = process.env.COOKIE_SECRET;

        this.extendConfiguration(configuration);
        this.registerModel(
            'User',
            require(path.join(this.root, 'lib/models/User'))
        );
        this.setupKoa();
        this.setupTemplates();
        this.setupCoreModules();        
        /* 
         * @todo Allow modules to hook in before doing this!
         */
        _.forEach(__modelObjects, function(obj, key) {                        
            __waterlineModels[key] = Waterline.Collection.extend(obj);
            waterline.loadCollection(__waterlineModels[key]);            
        });                                
        this.setupAuthentication();                
        let adminRouter = require('./adminRouter');
        this.koa.use(
            mount(
                '/admin', 
                adminRouter.routes()
            )
        );

        
        
    }

    setupCoreModules() {
        // Blog
        let Blog = require(path.join(this.root, 'lib/core_modules', 'blog'));
        return Blog.setup();
    }

    initCoreModules() {
        // Initialize the blog module
        let Blog = require(path.join(this.root, 'lib/core_modules', 'blog'));
        let blog = new Blog(this);
        __coreModules.blog = blog;
        let blogAdminRouter = blog.adminRouter(new Router());
        this.koa.use(
            mount('/admin/posts', blogAdminRouter.routes() )
        );
    }

    setupDatabase() {
        var ctx = this;

        this.logger.debug("Setting up database connection.");
        var dbConfig = this.configuration.database;
        var env = this.environment;
        var waterlineConfig = {
            defaults: {
                migrate: (env === 'production') ? 'safe' : 'alter'
            },
            adapters: {
                'default': mysqlAdapter,
                mysql: mysqlAdapter
            },
            connections: {
                'mysqlDefault': {
                    adapter: 'mysql',
                    user: dbConfig.mysql.user,
                    host: dbConfig.mysql.host,
                    password: dbConfig.mysql.pass,
                    database: dbConfig.mysql.db
                }
            }
        };


        return new Promise(function(resolve, reject) {
            waterline.initialize(waterlineConfig, function(err, models) {
                if (err) {
                    return reject(err);
                } else {                                  
                    __waterlineInstances = models.collections;                    
                    __connections = models.connections;
                    return resolve(models);
                }
            });
        });

    }
    start() {
        var ctx = this;
        return this.setupDatabase()
                .then(function () {
                    ctx.initCoreModules();
                });
    }
    /**
     * Puts a model in the model queue.
     * This allows models to be extended and more before being initialized to the ORM.
     *
     * @param {string} [modelName] - The unique name of the model to register.
     * @param {object} [obj] - The model object, refer to the Waterline ORM documentation
     * @todo Handle name clashes
     * @see https://github.com/balderdashy/waterline-docs
     */
    registerModel(modelName, obj) {
        __modelObjects[modelName] = obj;
    }
    /** 
     * Extend a models attributes in the model queue.
     *
     * @param {string} [modelName] - Model to extend
     * @param {object} [obj] - The attributes to extend the model with
     * @see https://github.com/balderdashy/waterline-docs
     * @example
     * app.extendModelAttributes('User', {
     *      posts: {
     *          collection: 'posts',
     *          via: 'author'
     *      }
     * });
     */
    extendModelAttributes(modelName, obj) {
        this.logger.debug(`Extending ${modelName} with`, obj);
        _.extend(__modelObjects[modelName].attributes, obj);
    }

    /** 
     * Sets up the authentication used throughout the CMS.
     * This is very much subject to change.
     */
    setupAuthentication() {
        var ctx = this;
        //  Setup sessions and authentication        
        var redisConfig = this.configuration.redis;
        this.koa.use(session({
            store: {
                host: redisConfig.host,
                port: redisConfig.port,
                ttl: redisConfig.ttl
            }
        }));


        this.koa.use(passport.initialize());
        this.koa.use(passport.session());
        this.koa.use(flash());           

        passport.use(new LocalStrategy(function(username, password, done) {
            ctx.models.user.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {

                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect email and/or password.'
                    });
                }

                var validPassword = user.verifyPassword(password);
                if (validPassword) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Incorrect email and/or password.'
                    });
                }

            });

        }));

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            ctx.models.user.findOne().where({
                id: id
            }).then(function(user) {
                done(null, user);
            });
        });        
    }
    /**
     * Setup the template language used by Riverian.
     * You can override this method yourself when extending the class.
     *
     * @param {string} [engine] - Engine to be used, only supported is swig.
     */
    setupTemplates(engine) {
        engine = engine || 'swig';
        if (engine !== 'swig')
            throw new RiverianError('Swig is the only supported engine right now.');

        swigExtras.useFilter(swig, 'truncate');
        this.koa.use(views({
            default: 'swig',
            root: path.join(this.root, '/admin/views')
        }));

        if (this.environment === 'development') {
            swig.setDefaults({
                cache: false
            });
        }

    }
    /** 
     * Setup the base koa application.
     * You can override this method yourself when extending the class.
     */
    setupKoa() {
        var ctx = this;
        // Log requests
        this.koa.use(function * (next) {
            ctx.logger.debug('[' + this.request.method + '] Request for ' + this.request.path);
            yield next;
        });

        this.koa.use(function *(next) {
          try {
            yield next;
          } catch (err) {
            this.status = err.status || 500;
            this.body = err.message;
            this.app.emit('error', err, this);
          }
        });
        
        // Koa sessions uses this
        this.koa.keys = [this.configuration.cookie_secret];
        // serve the admin static folders publically under /admin/static
        this.koa.use(
            mount(
                '/admin/static',
                serve(path.join(this.root, '/admin/dist'))
            )
        );
        // Use the bodyparser
        this.koa.use(bodyParser());
    }    

    *protect (next) {

        if (!this.isAuthenticated()) {
            this.flash = {
                error: 'Must be logged in to access this page.'
            };
            this.redirect('/admin/login');
        } else if (this.request.user && !this.request.user.userlevel == 10) {
            this.flash = {
                error: 'Must be admin.'
            };
            this.redirect('/admin/login');
        } else {
            yield next;
        }

    }

    static CTX () {
        return __ctx;
    }
}


Riverian.RiverianModule = require('./RiverianModule.js');
Riverian.Error = RiverianError;
exports.Riverian = module.exports = Riverian;