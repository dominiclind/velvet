'use strict';
const _ = require('lodash');
const path = require('path');
const Velvet = require('../../');
const VelvetModule = require('../../').VelvetModule;
const PostModel = require('./models/Post');
const PostCategoryModel = require('./models/PostCategory');
const PostTagModel = require('./models/PostTag');
const koaJSON = require('koa-json');



const CTX = Velvet.CTX();
const adminPrefix = '/admin/blog';

class PostModule extends VelvetModule {

  constructor(ctx) {
    super();
  }

  static Setup() {

    // Register the models to Velvet
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

    CTX.registerAdminMenu('Blog', {
      'List': adminPrefix + '/',
      'Add New': adminPrefix + '/post/new'
    }, {
      icon: 'ion-ios-book'
    });

  }

  static Views() {
    return {
      'core_modules/blog/admin/post-list': path.join(__dirname, 'views/admin/post-list.swig'),
      'core_modules/blog/admin/new-edit': path.join(__dirname, 'views/admin/new-edit.swig'),
      'core_modules/blog/admin/new-edit-distraction-free': path.join(__dirname, 'views/admin/new-edit-distraction-free.swig')
    }
  }

  /**
   * [GET] generators
   */
  * listPostsPage() {
    var self = this;
    var Post = CTX.models.post;
    var PostTags = CTX.models.posttags;
    var posts = yield Post.find()
      .populate('tags')
      .populate('categories')
      .populate('author');

    yield self.render('/core_modules/blog/admin/post-list', {
      posts: posts,
      messages: {
        errors: self.flash.error,
        info: self.flash.info
      }
    });
  }

  * createNewPage() {
    yield this.render('/core_modules/blog/admin/new-edit-distraction-free');
  }


  * editPostPage(req, res) {

    var Post = CTX.models.post;

    var post = yield Post.findOne()
      .where({
        id: this.params.id
      })
      .populate('tags')
      .populate('categories')
      .populate('author')

    yield this.render('/core_modules/blog/admin/new-edit-distraction-free', {
      post: post
    });

  }

  * deletePostById() {
    var Post = CTX.models.post;
    yield Post.destroy({
      id: this.params.id
    });
    this.flash.success = 'Successfully deleted post.';
    this.redirect('/admin/blog');
  }


  /**
   * [POST] generators
   */
  * handleCreatePost() {
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
    var tagObjects = _.map(postedTags, function(k) {
      return {
        name: k
      }
    });

    var tags = yield PostTags.findOrCreate(tagObjects, tagObjects);
    post.tags.add(tags);
    yield post.save();
    return this.redirect(adminPrefix);
  }

  publicRouter(router) {

  }

  adminRouter(router) {

    router.prefix(adminPrefix);
    router.get('/', CTX.protect, this.listPostsPage);
    router.get('/post/new', CTX.protect, this.createNewPage);
    router.post('/post/new', CTX.protect, this.handleCreatePost);
    router.get('/post/edit/:id', CTX.protect, this.editPostPage);
    router.get('/post/delete/:id', CTX.protect, this.deletePostById)


    router.post('/edit/:id', CTX.protect, function(req, res) {

    });

    return router;
  }

  apiRouter(router) {

    router.prefix('/api/blog');
    router.use(koaJSON());
    /**
     * @api {get} /blog/posts.json Multiple posts
     * @apiName GetBlogPosts
     * @apiGroup Blog
     */
    router.get('/posts.json', function* getPosts(next) {
      const posts = yield CTX.models.post.find()
        .populate('tags')
        .populate('categories')
        .populate('author');

      yield this.body = posts;
    });
    /**
     * @api {get} /blog/posts/:id.json Single post
     * @apiName GetBlogPost
     * @apiGroup Blog
     *
     * @apiParam {Number} id Posts unique ID.
     *
     * @apiSuccess {Number} id ID of the Post.
     * @apiSuccess {String} title Title of the Post.
     * @apiSuccess {String} createdAt Creation date of the Post.
     * @apiSuccess {String} updatedAt Update date of the Post.
     * @apiSuccess {String} content Content of the Post.
     * @apiSuccess {Object} author  User object of the post.
     * @apiSuccess {Object[]} categories  Array of category objects of the post.
     * @apiSuccess {Object[]} tags  Array of tag objects of the post.
     */
    router.get('/posts/:id.json', function* getPosts(next) {
      const post = yield CTX.models.post.find()
        .where({
          id: Number(this.params.id)
        })
        .populate('tags')
        .populate('categories')
        .populate('author');

      if (post.length = 0) {
        this.response.statusCode = 204;
      }

      this.body = (post.length == 1) ? post[0] : {};
      yield next;
    });

    /**
     * @api {post} /blog/posts Create posts
     * @apiName CreatePosts
     * @apiGroup Blog
     *
     * @apiParam {String} title
     * @apiParam {String} content
     * @apiParam {Number} author_id
     * @apiParam {String[]} tags Comma seperated list of tags (strings)
     * @apiParam {Number[]} categories Categories by id
     */
    router.post('/posts', function* getPosts(next) {
      var data = this.request.body;
      console.log(data);
      // var Post = CTX.models.post;
      // var PostTags = CTX.models.posttags;
      //
      // var post = yield Post.create({
      //   title: data.title,
      //   content: data.content,
      //   author: this.session.passport.user
      // });
      // // Create tag objects out of the comma separated field
      // // {
      // //    name: "my tag"
      // // }
      // var postedTags = data.tags.split(',');
      // var tagObjects = _.map(postedTags, function(k) {
      //   return {
      //     name: k
      //   }
      // });
      //
      // var tags = yield PostTags.findOrCreate(tagObjects, tagObjects);
      // post.tags.add(tags);
      // yield post.save();
    });

    return router;
  }

}

exports = module.exports = PostModule;
