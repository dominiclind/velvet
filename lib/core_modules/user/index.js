'use strict';
var _ = require('lodash');
var path = require('path');
var Velvet = require('../../');
var VelvetModule = require('../../').VelvetModule;
var UserModel = require('./models/User');
const session = require('koa-session-redis');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const flash = require('koa-flash');

const CTX = Velvet.CTX();
const adminPrefix = '/admin/users';

class UserModule extends VelvetModule {

    constructor(ctx) {
        super();
    }

    static Setup() {

        // Register the models to Velvet
        CTX.registerModel('User', UserModel);

        CTX.registerAdminMenu('Users', {
            'List': adminPrefix + '/',
            'Add New': adminPrefix + '/post/new'
        }, {
          icon: 'ion-person'
        });


    }

    static Extends() {

        /**
         * Sets up the authentication used throughout the CMS.
         * This is very much subject to change.
         */

        //  Setup sessions and authentication
        var redisConfig = CTX.configuration.redis;
        CTX.koa.use(session({
            store: {
                host: redisConfig.host,
                port: redisConfig.port,
                ttl: redisConfig.ttl
            }
        }));


        CTX.koa.use(passport.initialize());
        CTX.koa.use(passport.session());
        CTX.koa.use(flash());
        console.log(Velvet.CTX(), "yo");
        passport.use(new LocalStrategy(function(username, password, done) {
            console.log(Velvet.CTX(), "yo");
            Velvet.CTX().models.user.findOne({
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
            Velvet.__ctx().models.user.findOne().where({
                id: id
            }).then(function(user) {
                done(null, user);
            });
        });
    }

    static Views() {
    	return {}
    }


    apiRouter(router) {
      return router;
    }

    publicRouter(router) {
      return router;
    }

    adminRouter(router) {

        router.prefix(adminPrefix);
        return router;
    }

}

exports = module.exports = UserModule;
