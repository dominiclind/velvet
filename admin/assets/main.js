/** sass libraries */
require('normalize.css');
require('breakpoint-sass');
/** css libraries **/
/** js libraries */
const $ = require('jquery');
const riot = require('riot');
const MediumEditor = require('medium-editor');

require('./styles/main.scss');

/** require tags */
require('./tags/list-view.js');

riot.tag('editor', `
	<textarea class="editor" name="{ opts.name }">
		{ content }
	</textarea>`
, function editor (opts) {

	this.content = this.root._innerHTML;
	this.editor = null;
	this.on('mount', function () {
		var textarea = this.root.querySelectorAll('textarea');
		this.editor = new MediumEditor(textarea);
	});
});

$(document).ready(function () {
		riot.mount('*');
});


//
// $(document).ready(function () {
//
// 	//window.sr = new scrollReveal();
//
// 	// $('.wysiwyg').each(function () {
// 	// 	var inline = $(this).attr('data-inline');
// 	// 	inline = (inline === "true");
// 	// 	$(this).editable({inlineMode: inline});
// 	// });
//
// 	// var elements = document.querySelectorAll('.editor'),
// 	//     editor = new MediumEditor(elements);
//
//
//
// 	// $('.submit-form').click(function (ev) {
// 	// 	ev.preventDefault();
// 	// 	var $form = $($(this).attr('data-form'));
// 	// 	$form.submit();
// 	// });
//
// 	//$('input[data-role="tags"]').tagsInput();
// 	//var l = Ladda.bind( '[role="submit"]' );
// 	//
// 	// $('.sidebar-nav .toggle-dropdown').click(function (e) {
// 	// 	var $target = $( $(this).attr('data-target') );
// 	//
// 	// 	if ( $target.hasClass('toggled') ) {
// 	// 		$(this).removeClass('expanded');
// 	// 		return $('.sidebar-nav .dropdown').removeClass('toggled');
// 	// 	}
// 	//
// 	// 	$('.sidebar-nav .toggle-dropdown').removeClass('expanded');
// 	// 	$('.sidebar-nav .dropdown').removeClass('toggled');
// 	// 	$target.addClass('toggled');
// 	// 	$(this).addClass('expanded');
// 	//
// 	// });
//
// });
