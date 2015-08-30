$(document).ready(function () {

	window.sr = new scrollReveal();
	$('.wysiwyg').editable({inlineMode: true})
    $('.multiselect').multiselect();
    $('.dropdown-toggle').dropdown();

    var l = Ladda.bind( '[role="submit"]' );
});