var Waterline = require('waterline');


var PostCategory = Waterline.Collection.extend({
	identity: 'postcategory',
	connection: 'mysqlDefault',
	attributes: {
		name: 'string',		
		posts: {
			collection: 'post',
			via: 'categories'
		}
	}
});

exports = module.exports = PostCategory;