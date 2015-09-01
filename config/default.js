module.exports = function () {
	return {
		use_proxy: false,
		redis: {
			host: "localhost",
			port: 6379,
			ttl: 3600			
		},
		database: {
			mysql: {
				host: "127.0.0.1"
			}
		}
	}
};