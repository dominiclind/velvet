exports = module.exports = function contactModule (riverian, DataType) {
	
	var admin = riverian.createAdminModule('contact-form');
	var pub = riverian.createPublicModule('contact-form');
	
	// It's considered best practice to prefix the model with
	// the module name or an abbrevation of it as in {modulename}-model_name
	var ContactFormModel = riverian.model.define('cf-contact_form', {
		name: {
			type: DataType.STRING,
			field: 'name'
		}
	});

	// Add relations
	ContactFormModel.belongsTo( riverian.model('User'), { as : 'createdBy'} );

	// Register an admin menu, these are hidden an shown on expand
	admin.addMenu({
		'Contact Forms': 'contact-forms',
		'Add New': 'add-new'
	});	


	// Register some admin routes, these will be mounted 
	// under the module name e.g. contact-form/add-new
	admin.router.get('/add-new', function (req, res) {
		riverian.view.render('views/add-new');
	});

	admin.router.get('/contact-forms', function (req, res) {
		riverian.view.render('views/list-forms');
	});

	// Register a view block that can be placed via the admin interface
	pub.registerBlock('cf-contact_form', 'Contact Form', 'views/contact-form-block.html');

	// This will be placed under '/contact'
	pub.router.get('/', function (req, res) {
		riverian.view.render('views/contact-page');
	});

	// Return a promise
	return {
		setup: function () {
			ContactFormModel.sync();	
		}
		
	}

}