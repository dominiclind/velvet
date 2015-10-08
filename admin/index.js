'use strict';
const path = require('path');
const Router = require('koa-router');
const passport = require('koa-passport');
const velvet = require('../lib/index');
const CTX = velvet.CTX();
const mount = require('koa-mount');
const serve = require('koa-static');

const admin = new Router();

// //admin.use('/posts', postRouter.admin);
admin.get('/login', function * login () {
    yield this.render('admin/login', {
        messages: this.flash
    });
});

admin.post('/login', function * doLogin (next) {
    var ctx = this
    yield passport.authenticate('local', function * authenticate(err, user, info) {
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

admin.get('/', CTX.protect, function * dashboard () {
    yield this.render('/admin/dashboard');
});

/** serve static files under the dist folder */
CTX.koa.use( mount('/admin/static', serve(path.join(path.resolve(__dirname), 'dist'))));


/** small helper so we dont have to write path.join(__dirname...) for all views */
function v(p) {
  return path.join(__dirname, p);
}

module.exports = {
    router: admin,
    views: function adminviews () {
        return {
            'admin/layouts/main': v('views/layouts/main.swig'),
            'admin/layouts/distraction-free': v('views/layouts/distraction-free.swig'),
            'admin/login': v('views/login.swig'),
            'admin/partials/head': v('views/partials/head.swig'),
            'admin/dashboard': v('views/dashboard.swig'),
            'admin/partials/sidebar': v('views/partials/sidebar.swig'),
            'admin/partials/navbar-top': v('views/partials/navbar-top.swig')
        }
    }
}
