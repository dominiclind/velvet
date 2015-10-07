$(document).ready(function () {

	window.sr = new scrollReveal();

	// $('.wysiwyg').each(function () {
	// 	var inline = $(this).attr('data-inline');
	// 	inline = (inline === "true");
	// 	$(this).editable({inlineMode: inline});
	// });

	if (document.getElementById('dante-editor')) {
		var editor = new Dante.Editor({
	        el: "#dante-editor",
	        upload_url: "/images.json", //it expect an url string in response like /your/server/image.jpg or http://app.com/images/image.jpg
	        store_url: "/save" //post to save
	  });
		editor.start();

		console.log("here...");
	}
	$('input[data-role="tags"]').tagsInput();


	var l = Ladda.bind( '[role="submit"]' );

	$('.sidebar-nav .toggle-dropdown').click(function (e) {
		var $target = $( $(this).attr('data-target') );

		if ( $target.hasClass('toggled') ) {
			$(this).removeClass('expanded');
			return $('.sidebar-nav .dropdown').removeClass('toggled');
		}

		$('.sidebar-nav .toggle-dropdown').removeClass('expanded');
		$('.sidebar-nav .dropdown').removeClass('toggled');
		$target.addClass('toggled');
		$(this).addClass('expanded');

	});

});
