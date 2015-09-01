var PostTags = {
	identity: 'posttags',
	connection: 'mysqlDefault',
	attributes: {
		name: 'string',		
		posts: {
			collection: 'post',
			via: 'tags'
		}
	}
};

exports = module.exports = PostTags;