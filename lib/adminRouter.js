'use strict';
var Router = require('koa-router');
var CTX = require('./').CTX();
var riverian = require('./index');
var passport = require('koa-passport');
//var postRouter = require('./routers/postRouter');

var admin = new Router();

// //admin.use('/posts', postRouter.admin);
admin.get('/login', function *() {
	yield this.render('login', {
		messages: this.flash
	});
});

admin.post('/login', function *(next) {
	var ctx = this	
	yield passport.authenticate('local', function* (err, user, info) {
		if (err) 
			throw err;		
		if (!user) {		  
		  ctx.flash = { error: 'Wrong username and/or password.' };
		  ctx.redirect('/admin/login');
		} else {
		  yield ctx.login(user);
		  ctx.redirect('/admin');
		}
	}).call(this, next)	
});

admin.get('/', CTX.protect, function *() {		
	yield this.render('dashboard');
});

/*
admin.get('/posts/new', function (req, res) {
	res.render('posts-new');
});
*/

exports = module.exports = admin;