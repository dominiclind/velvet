var Post = {
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

exports = module.exports = Post;