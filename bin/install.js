var riverian = require('../lib');

var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

riverian.setup(process.cwd());

riverian.start().then(function () {
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
	
}).catch(function (e) {
	console.log(e);
});
