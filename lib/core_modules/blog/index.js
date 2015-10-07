'use strict';
var _ = require('lodash');
var path = require('path');
var Riverian = require('../../');
var RiverianModule = require('../../').RiverianModule;
var PostModel = require('./models/Post');
var PostCategoryModel = require('./models/PostCategory');
var PostTagModel = require('./models/PostTag');

const CTX = Riverian.CTX();
const adminPrefix = '/admin/blog';

class PostModule extends RiverianModule {

    constructor(ctx) {
        super();
    }

    static Setup() {

        // Register the models to Riverian
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

        CTX.registerAdminMenu('Blog',
          {
              'List': adminPrefix + '/',
              'Add New': adminPrefix + '/post/new'
          },
          {
            icon: 'ion-ios-book'
          }
        );

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

}

exports = module.exports = PostModule;
