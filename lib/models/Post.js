var Waterline = require('waterline');


var Post = Waterline.Collection.extend({
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
});

exports = module.exports = Post;