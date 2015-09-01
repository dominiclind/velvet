var PostCategory = {
	identity: 'postcategory',
	connection: 'mysqlDefault',
	attributes: {
		name: 'string',		
		posts: {
			collection: 'post',
			via: 'categories'
		}
	}
};

exports = module.exports = PostCategory;