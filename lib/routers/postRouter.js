var express = require('express');
var riverian = require('../');
var _ = require('lodash');
var admin = express.Router();
var pub = express.Router();


admin.get('/', riverian.protect, function (req, res) {
	var Post = riverian.models.post;
	var PostTags = riverian.models.posttags;	
	
	Post.find()
		.populate('tags')
		.populate('categories')
		.populate('author')
		.then(function (posts) {	

			return res.render('posts-list', {
				posts: posts,
				messages: {
					errors: req.flash().error || null,
					info: req.flash().info || null
				}
			});	

		});

});

admin.get('/new', riverian.protect, function (req, res) {	
	res.render('posts-new-edit');
});

admin.get('/edit/:id', riverian.protect, function (req, res) {	

	var Post = riverian.models.post;
	Post.findOne()
		.where({ id: req.params.id })
		.populate('tags')
		.populate('categories')
		.populate('author')
		.then(function (post) {			
			return res.render('posts-new-edit', {
				post: post				
			});

		});
});

admin.post('/edit/:id', riverian.protect, function (req, res) {	

	var data = req.body;
	var Post = riverian.models.post;
	var PostTags = riverian.models.posttags;
	Post.findOne()
		.where({ id: req.params.id })	
		.populate('tags')
		.populate('author')
		.populate('categories')		
		.then(function (post) {		

		});
});


admin.post('/new', riverian.protect, function (req, res) {

	var data = req.body;
	var Post = riverian.models.post;
	var PostTags = riverian.models.posttags;
	

	Post.create({
		title: data.title,
		content: data.content,
		author: req.user.id		
	})
		.then(function (post) {

			// Create tab objects out of the comma separated field
			// {
			//    name: "my tag"
			// }
			var postedTags = data.tags.split(',');
			var tagObjects = _.map(postedTags, function (k) {				
				return { name: k }
			});			

			PostTags.findOrCreate(tagObjects, tagObjects)				
				.then(function (tags) {
					post.tags.add(tags);
					post.save().then(function () {
						return res.redirect('/admin/posts');
					}).catch(function (e) {
						riverian.logger.error(e);
						req.flash('Something went wrong, contact an administrator.');
						return res.redirect('/admin/posts');
					});
				});				

		});

});

admin.get('/delete/:id', riverian.protect, function (req, res) {

	var Post = riverian.models.post;
	Post.destroy({ id: req.params.id })
		.then(function() {
			req.flash('Successfully deleted post.');
			res.redirect('/admin/posts');
		});

});

exports = module.exports = {
	pub: pub,
	admin: admin
}

