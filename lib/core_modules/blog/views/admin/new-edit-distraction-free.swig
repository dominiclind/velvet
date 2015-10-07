{% extends '/admin/layouts/distraction-free' %}

{% block content %}

		<nav class="top">
			<div class="brand">r<i class="ion-flash"></i>verian</div>
			<div class="right">
				<a href="../" class="danger">Cancel</a>
				<a href="../">Save</a>
				<a href="../" class="primary">Publish</a>
			</div>
		</nav>


		<div class="container-center blog-edit">
			<form method="post" action="">
				<textarea name="title" placeholder="Title..." class="autogrow"></textarea>
				<textarea id="dante-editor" {% if !post.content %} placeholder="Story goes here..." {% endif %} data-inline="true" name="content">
					{%if post.content %}
						{{ post.content }}
					{% endif %}
				</textarea>
			</form>
		</div>


		<nav class="fixed-bottom container">
			<div class="tags">
				<input
					data-role="tags"
					type="text"
					name="tags" placeholder="Enter tags.."
					value="{% for tag in post.tags %}{{tag.name}},{% endfor %}"
				/>
			</div>
		</nav>

{% endblock %}
