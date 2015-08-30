var express = require('express');
var admin = express.Router();
var riverian = require('./index');
var passport = require('passport');
var postRouter = require('./routers/postRouter');

admin.use('/posts', postRouter.admin);
admin.get('/login', function (req, res) {
	res.render('login', {
		messages: req.flash()
	});
});

admin.post('/login', passport.authenticate('local', { 
	successRedirect: '/admin',
	failureRedirect: '/admin/login',
	failureFlash: true 
}));

admin.get('/', riverian.protect, function (req, res) {
	res.render('dashboard');
});

/*
admin.get('/posts/new', function (req, res) {
	res.render('posts-new');
});
*/

exports = module.exports = admin;