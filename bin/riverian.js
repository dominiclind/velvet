'use strict';
const Riverian = require('../lib');

class App extends Riverian {
	
	constructor (root) {
		super(root);
		// Put your own constructor logic here.
	}		

};
const app = new App( process.cwd() );


//
// You can't set configuration properties directly 
// but you can use the extendConfiguration method to
// achieve it, e.g.:
// 	app.extendConfiguration({ use_proxy: true })
//
app.setup(app); // This is to so we can store the context safely
app.start().then(function () {
	app.koa.listen(3000);
});

