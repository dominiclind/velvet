var PostModel = {
	identity: 'post',
	connection: 'mysqlDefault',
	attributes: {
		title: 'string',
		content: 'text',

		author: {
			model: 'user'
		},

		categories: {
			collection: 'postcategory',
			via: 'posts',
			dominant: true
		},

		tags: {
			collection: 'posttags',
			via: 'posts',
			dominant: true
		}		
	}
};

class PostModule extends RiverianModule {
	
	constructor() {
		super(this);
		// Define models.
		// Riverian looks for these using models();
		this.models = {
			Post: PostModel,
			Category: PostCategoryModel,
			Tag: PostTagModel			
		}
		// Define menus.
		this.menus = {			
			admin: [{
				'List': 'posts',
				'Add New': 'add-new'
			}],
			pub: [
				'Posts', 'posts'
			]
		}

	}

	get models() {
		return this.models;
	}	

	get menus() {
		return this.models;
	}

	publicRouter(router) {

	}

	adminRouter(router) {
		

		router.get('/', riverian.protect, function *() {
			var ctx = this;
			var Post = this.models.Post;
			var PostTags = this.models.PostTagModel;	
			
			Post.find()
				.populate('tags')
				.populate('categories')
				.populate('author')
				.then(function (posts) {	

					yield res.render('posts-list', {
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


		return;
	}

}

riverian.registerPlugin(PostModule, 'postModule');
