'use strict';
var _ 					= require('lodash');
var Riverian 			= require('../../');
var RiverianModule 		= require('../../').RiverianModule;
var PostModel 			= require('./models/Post');
var PostCategoryModel 	= require('./models/PostCategory');
var PostTagModel 		= require('./models/PostTag');

const CTX = Riverian.CTX();

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
		CTX.registerModel('Post', PostModel);
		CTX.registerModel('PostCategoryModel', PostCategoryModel);
		CTX.registerModel('PostTagModel', PostTagModel);
		// Extend the core user model so we can get all the
		// posts by a specific user.
		CTX.extendModelAttributes('User', {
			posts: {
				collection: 'post',
				via: 'author'
			}
		});
	}

	publicRouter(router) {

	}


	/**
 	 * [GET] generators
 	 */
	* listPostsPage () {
		var self = this;
		var Post = CTX.models.post;			
		var PostTags = CTX.models.posttags;							
		var posts = yield Post.find()
			.populate('tags')
			.populate('categories')
			.populate('author');			

		yield self.render('posts-list', {
			posts: posts,
			messages: {
				errors: self.flash.error,
				info: self.flash.info
			}
		});						
	}

	* createNewPage () {
		yield this.render('posts-new-edit');		
	}


	* editPostPage (req, res) {	

		var Post = CTX.models.post;
		
		var post = yield Post.findOne()
			.where({ id: this.params.id })
			.populate('tags')
			.populate('categories')
			.populate('author')
		
		yield this.render('posts-new-edit', {
			post: post				
		});

	}

	* deletePostById () {		
		var Post = CTX.models.post;
		yield Post.destroy({ id: this.params.id });			
		this.flash.success = 'Successfully deleted post.';
		this.redirect('/admin/posts');				
	}


	/**
	 * [POST] generators
	 */
	* handleCreatePost () {

			var data = this.request.body;
			var Post = CTX.models.post;
			var PostTags = CTX.models.posttags;

			var post = yield Post.create({
				title: data.title,
				content: data.content,
				author: this.session.passport.user
			});				
			// Create tag objects out of the comma separated field
			// {
			//    name: "my tag"
			// }
			var postedTags = data.tags.split(',');
			var tagObjects = _.map(postedTags, function (k) {				
				return { name: k }
			});			

			var tags = yield PostTags.findOrCreate(tagObjects, tagObjects);
			post.tags.add(tags);
			yield post.save();
			return this.redirect('/admin/posts');									

		}

	adminRouter (router) {
		

		router.get('/', 			CTX.protect, this.listPostsPage);
		router.get('/new', 			CTX.protect, this.createNewPage);
		router.get('/edit/:id', 	CTX.protect, this.editPostPage);
		router.get('/delete/:id', 	CTX.protect, this.deletePostById) 
		router.post('/new', 		CTX.protect, this.handleCreatePost);

		router.post('/edit/:id', CTX.protect, function (req, res) {	

		});
		


		return router;
	}

}

exports = module.exports = PostModule;

