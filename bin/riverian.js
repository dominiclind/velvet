var riverian = require('../lib');


// Riverian configuration priority:
//	.env/environment variables => config/environments/{environment}.js file => default config file
riverian.setup(process.cwd());

riverian.start().then(function () {

var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


var User = riverian.models.user;
	var pass = randomString(8);
	User.create({
		username: 'admin',
		firstname: 'admin',
		lastname: 'admin',
		password: pass,
		userlevel: 10
	}).then(function (user) {				
		
		riverian.logger.info('Successfully created admin user admin');		
		riverian.logger.info('Admin password: ', pass);		

	});
	
	riverian.express.listen(3000);	
	
}).catch(function (e) {

	console.log(e);
	
});
