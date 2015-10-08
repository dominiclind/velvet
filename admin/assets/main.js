
/** sass libraries */
require('normalize.css');
require('breakpoint-sass');
require('./styles/main.scss');
/** css libraries **/
/** js libraries */
// const $ = require('jquery');
// const riot = require('riot');
// const MediumEditor = require('medium-editor');
//
//
//
// /** require tags */
// //require('./tags/list-view.js');
// //
// // riot.tag('editor', `
// // 	<textarea class="editor" name="{ opts.name }">
// // 		{ content }
// // 	</textarea>`
// // , function editor (opts) {
// //
// // 	this.content = this.root._innerHTML;
// // 	this.editor = null;
// // 	this.on('mount', function () {
// // 		var textarea = this.root.querySelectorAll('textarea');
// // 		this.editor = new MediumEditor(textarea);
// // 	});
// // });
//
// $(document).ready(function () {
// 		//riot.mount('*');
// });

const riverian = require('./scripts/riverian.js');
const React = require('react');
const ReactDOM = require('react-dom');
const mobservable = require('mobservable');
const reactiveComponent = require('mobservable-react').reactiveComponent;



const ListView = riverian.component('list-view', {
	render() {
		return(
			<h2>Koala</h2>
		)
	}
});


if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', riverian.run);
} else {
  window.attachEvent('onload', riverian.run);
}



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
