var riverian = require('../lib');

riverian.setup(process.cwd());
riverian.start().then(function () {
	var User = riverian.models.user;
	User.create({
		username: 'admin',
		firstname: 'admin',
		lastname: 'admin',
		password: 'adminadmin',
		userlevel: 10
	}).then(function (user) {				
		
		riverian.logger.info('Successfully created admin user admin');		
		

	});
	
}).catch(function (e) {
	console.log(e);
});
