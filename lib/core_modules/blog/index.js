'use strict';
var Riverian 			= require('../../');
var RiverianModule 		= require('../../').RiverianModule;
var PostModel 			= require('./models/Post');
var PostCategoryModel 	= require('./models/PostCategory');
var PostTagModel 		= require('./models/PostTag');

class PostModule extends RiverianModule {
	
	constructor(ctx) {
		super();
		// Define models.								
		// Define menus.
		// this.menus = {			
		// 	admin: [{
		// 		'List': 'posts',
		// 		'Add New': 'add-new'
		// 	}],
		// 	pub: [
		// 		'Posts', 'posts'
		// 	]
		// }

	}

	static setup() {
		let CTX = Riverian.CTX();
		CTX.registerModel('Post', PostModel);
		CTX.registerModel('PostCategoryModel', PostCategoryModel);
		CTX.registerModel('PostTagModel', PostTagModel);
	}

	publicRouter(router) {

	}

	adminRouter (router) {
		

		router.get('/', CTX.protect, function *() {
			var ctx = this;
			var Post = this.models.Post;
			var PostTags = this.models.PostTagModel;	
			
			Post.find()
				.populate('tags')
				.populate('categories')
				.populate('author')
				.then(function (posts) {	

					return res.render('posts-list', {
						posts: posts,
						messages: {
							errors: ctx.flash.error,
							info: ctx.flash.info
						}
					});	

				});

		});

		router.get('/new', riverian.protect, function (req, res) {	
			res.render('posts-new-edit');
		});

		router.get('/edit/:id', riverian.protect, function (req, res) {	

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

		router.post('/edit/:id', riverian.protect, function (req, res) {	

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


		router.post('/new', riverian.protect, function (req, res) {

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

		router.get('/delete/:id', riverian.protect, function (req, res) {
			var Post = riverian.models.post;
			Post.destroy({ id: req.params.id })
				.then(function() {
					req.flash('Successfully deleted post.');
					res.redirect('/admin/posts');
				});

		});


		return router;
	}

}

exports = module.exports = PostModule;

