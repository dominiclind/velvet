'use strict';

var Riverian = require('../lib');

class App extends Riverian {

	constructor (root) {
		super(root);
		// Put your own constructor logic here.
	}

};
const app = new App( process.cwd() );
app.setup(app); // This is to so we can store the context safely

app.start().then(function () {
	var User = app.models.user;
	User.create({
		username: 'admin',
		firstname: 'admin',
		lastname: 'admin',
		password: 'password',
		userlevel: 10
	}).then(function (user) {

		app.logger.info('Successfully created admin user admin');


	});

}).catch(function (e) {
	console.log(e);
});
