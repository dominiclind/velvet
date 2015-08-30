var dotenv = require('dotenv');
var express = require('express');
var path = require('path');
var _ = require('lodash');
var swig = require('swig');
var swigExtras = require('swig-extras');
var winston = require('winston');
var Promise = require('bluebird');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
//
// NOTE: Riverian was designed to be a singleton. 
// So you can only have a single riverian running.
//
var riverian;
exports = module.exports = riverian || getriverian();
var app;

// Private variables
var _MODELS_ = {};
var _SETTINGS_ = {};
var waterline = new Waterline();
// Private methods

function loadCoreModels () {
		
	// No need to dynamically parse the filesystem for
	// the core models. Just waste of resources.
	loadCoreModel('User');
	// Blog post models
	loadCoreModel('Post');
	loadCoreModel('PostCategory');
	loadCoreModel('PostTag');

}

function loadCoreModel (name) {
	var Model = require('./models/'+name);
	_MODELS_[name] = Model.Model;	
	waterline.loadCollection(Model);
}

function loadCoreRouters () {
		
	// No need to dynamically parse the filesystem for
	// the core routers. Just waste of resources.
	var adminRouter = require('./adminRouter');	
	app.use('/admin', adminRouter);

}

function setupDatabase() {

	_LOGGER_.debug("Setting up database connection.");
	var dbConfig = riverian.get('database');					
	var env = riverian.get('ENVIRONMENT');
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

	
	return new Promise(function (resolve, reject) {
		waterline.initialize(waterlineConfig, function (err, models) {
			if (err) {
				return reject(err);
			} else {
				riverian.models = models.collections;
				riverian.connections = models.connections;
				return resolve(models);
			}
		});
	});	

}

function setupExpress() {

	app.use(function (req, res, next) {

		riverian.logger.debug('[' + req.method + '] Request for ' + req.path);
		return next();

	});

	// Setup static for admin routes
	app.use('/admin/static', express.static( path.join(riverian.get('ROOT'), '/admin/dist')) );	
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	// parse application/json
	app.use(bodyParser.json())
}

function setupTemplates() {
	// Configure templates
	// We use swig (http://paularmstrong.github.io/swig/)
	swigExtras.useFilter(swig, 'truncate');
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', path.join(riverian.get('ROOT'), '/admin/views'));
	// Swig will cache templates for you, but you can disable
	// that and use Express's caching instead, if you like:
	app.set('view cache', false);
	if (riverian.get('ENVIRONMENT') === 'development') {
		swig.setDefaults({ cache: false });
	}
	// NOTE: You should always cache templates in a production environment.
	// Don't leave both of these to `false` in production	
}

function setupAuthentication() {
	
	//  Setup sessions and authentication
	var sess = {
	  secret: riverian.get('cookie_secret'),  
	  resave: false,
	  saveUninitialized: false,
	  cookie: {},
	  store: new RedisStore({
	  	host: 'localhost'
	  }),  
	}

	if (riverian.get('use_proxy')) {
		app.set('trust proxy', 1) // trust first proxy
	}

	/*if (config.env === 'production') {
	  sess.cookie.secure = true // serve secure cookies
	}*/	
	app.use(session(sess));
	///app.use(cookieParser({ secret: riverian.get('cookie_secret') }));
	app.use(cookieParser());
	app.use(passport.initialize());
	app.use(passport.session());  
	app.use(flash());



	passport.use(new LocalStrategy(function(username, password, done) {		
		riverian.models.user.findOne({ where: { username: username }}).then(function (user) {
				
				if (!user) {
		  			return done(null, false, { message: 'Incorrect email and/or password.' });
				}

				var validPassword = user.verifyPassword(password);

		  		if (validPassword) {
		  			return done(null, user);	  			
		  		} else {
		  			return done(null, false, { message: 'Incorrect email and/or password.' });		  		
		  		}		  			

		});

	}));



	passport.serializeUser(function(user, done) {	
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  
	  riverian.models.user.findOne().where({id: id}).then(function (user) {
	  	done(null, user);
	  });

	});


}

// @todo make it possible to configure the logger
var _LOGGER_;

function Riverian() {

	_LOGGER_ = this.logger = new (winston.Logger)({
		transports: [ new (winston.transports.Console)({ colorize: true, level: 'debug', prettyPrint: true, silent: false })]
	});

	app = this.express = express();
	this.models = null;
	this.connections = null;
  	
}

Riverian.prototype.start = function start() {

	
	return setupDatabase();

}

// @todo add granular control...
Riverian.prototype.protect = function protect (req, res, next) {

	if (!req.isAuthenticated()) {
		req.flash('error', 'Must be logged in to access this page.');
		res.redirect('/admin/login');
	} else if (req.user && !req.user.userlevel == 10) {
		req.flash('error', 'Must be admin.');
		res.redirect('/admin/login');
	} else {
		next();
	}

}

Riverian.prototype.model = function model (name) {	
	return _MODELS_[name] || undefined;
}

Riverian.prototype.set = function (key, val) {
	this.logger.debug("Setting", key +"="+val);
	return _SETTINGS_[key] = val;
}

Riverian.prototype.get = function (key) {
	return _SETTINGS_[key];
}

Riverian.prototype.setup = function setup(rootPath) {
	
	dotenv.load();
	this.set('ROOT', rootPath);
	var ENVIRONMENT = process.env.NODE_ENV || null;	
	if ( !ENVIRONMENT ) {
	    this.logger.error("You need to set NODE_ENV in your .env file.");
	    process.exit(0);
	}	

	// Set the environment on the application object 
	this.set('ENVIRONMENT', ENVIRONMENT);	

	// Load the configuration files starting with the application wide configuration file
	var APPLICATION_CONFIG = require( path.join(this.get('ROOT'), '/config/default.js') )();
	this.logger.debug("Loaded default configuration", APPLICATION_CONFIG);
	// Try to load the environment specific configuration if it exists. 
	try {
	    var ENVIRONMENT_CONFIG = require( path.join(this.get('ROOT'), '/config/environments/'+ENVIRONMENT+'.js') )();
	    this.logger.debug("Loaded environment specific configuration", ENVIRONMENT_CONFIG);
	} catch (e) {
	    this.logger.info("No environment specific configuration found in /config/environments");
	}

	//
	// Environment specific configuration overwrites application wide configuration.
	// The more secret configuration options can be set in the .env file
	// 
	// The following options CAN and SHOULD be set in the .env file
	// 
	//  MYSQL_HOST
	//  MYSQL_USER
	//  MYSQL_PASS
	//	MYSQL_DB
	// 	COOKIE_SECRET
	//
	var CONFIGURATION = _.merge(APPLICATION_CONFIG, ENVIRONMENT_CONFIG);	

	CONFIGURATION.database = CONFIGURATION.database || {
		mysql: { host: null, user: null, pass: null }
	};

	if (process.env.MYSQL_HOST) 
	    CONFIGURATION.database.mysql.host = process.env.MYSQL_HOST;
	if (process.env.MYSQL_USER) 
	    CONFIGURATION.database.mysql.user = process.env.MYSQL_USER;
	if (process.env.MYSQL_PASS) 
	    CONFIGURATION.database.mysql.pass = process.env.MYSQL_PASS;
	if (process.env.MYSQL_DB) 
	    CONFIGURATION.database.mysql.db   = process.env.MYSQL_DB;
	if (process.env.COOKIE_SECRET) 
	    CONFIGURATION.cookie_secret   	  = process.env.COOKIE_SECRET;

	_.extend(_SETTINGS_, CONFIGURATION);
	
	this.logger.debug("Loaded ENV configuration");
	


	loadCoreModels();
	setupExpress();
	setupTemplates();
	setupAuthentication();
	loadCoreRouters();	
}


// Returns the riverian riverian. 
function getriverian () {
	riverian = new Riverian;
	return riverian;
}
