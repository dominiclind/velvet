{% extends '/admin/layouts/distraction-free' %}

{% block content %}
		<form method="post" action="" id="post">
			<nav class="top">
				<div class="brand">r<i class="ion-flash"></i>verian</div>
				<div class="right">
					<a href="../" class="danger">Cancel</a>
					<input type="submit" value="Save" />
					<a href="../" class="primary">Publish</a>
				</div>
			</nav>


			<div class="container-center blog-edit">
				<textarea name="title" placeholder="Title..." class="autogrow">{{post.title}}</textarea>
				<editor name="content">
					{{ post.content|safe }}
				</editor>
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
		</form>
{% endblock %}
