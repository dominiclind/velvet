var Waterline = require('waterline');


var PostTags = Waterline.Collection.extend({
	identity: 'posttags',
	connection: 'mysqlDefault',
	attributes: {
		name: 'string',		
		posts: {
			collection: 'post',
			via: 'tags'
		}
	}
});

exports = module.exports = PostTags;