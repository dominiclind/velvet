'use strict';
var path = require('path');
var Router = require('koa-router');
var passport = require('koa-passport');
var CTX = require('../').CTX();
var riverian = require('./index');
//var postRouter = require('./routers/postRouter');

var admin = new Router();

// //admin.use('/posts', postRouter.admin);
admin.get('/login', function * () {
    yield this.render('admin/login', {
        messages: this.flash
    });
});

admin.post('/login', function * (next) {
    var ctx = this
    yield passport.authenticate('local', function * (err, user, info) {
        if (err)
            throw err;
        if (!user) {
            ctx.flash = {
                error: 'Wrong username and/or password.'
            };
            ctx.redirect('/admin/login');
        } else {
            yield ctx.login(user);
            ctx.redirect('/admin');
        }
    }).call(this, next)
});

admin.get('/', CTX.protect, function * () {
    yield this.render('/admin/dashboard');
});

/*
admin.get('/posts/new', function (req, res) {
	res.render('posts-new');
});
*/

module.exports = {
    router: admin,
    views: function() {
        return {
            'admin/layouts/main': path.join(__dirname, 'views/layouts/main.swig'),
            'admin/login': path.join(__dirname, 'views/login.swig'),
            'admin/partials/head': path.join(__dirname, 'views/partials/head.swig'),
            'admin/dashboard': path.join(__dirname, 'views/dashboard.swig'),
            'admin/partials/sidebar': path.join(__dirname, 'views/partials/sidebar.swig')
        }
    }
}