{% extends '/admin/layouts/distraction-free' %}

{% block content %}
	<div class="container-fluid" id="notifications">
	</div>
	<div class="container-fluid">
		<div class="blog-content">
			<div class="card">
				<div class="card-header">
					<h2>New post</h2>
				</div>
				<div class="card-content">
					<form class="form form-stacked" method="post" action="">
						<div class="card col-xs-12">
							<div class="col-xs-12">
								<div class="form-group">
									<input type="text" class="form-control" name="title" placeholder="Post title..." value="{{ post.title }}"/>
								</div>
								<textarea class="wysiwyg" data-inline="true" name="content">{{ post.content }}</textarea>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<div class="blog-meta">
 			<div class="card tags">
				<div class="card-header">
					<h2><i class="ion-pricetags"></i> Tags</h2>
				</div>
				<div class="card-content">
					<div class="form form-stacked">
							<input
								data-role="tags"
								type="text"
								name="tags" placeholder="Enter tags.."
								value="{% for tag in post.tags %}{{tag.name}},{% endfor %}"
						/>
					</div>
				</div>
			</div>
			<div class="card categories">
				<div class="card-header">
					<h2><i class="ion-ios-folder"></i> Categories</h2>
				</div>
				<div class="card-content">
					<div class="form form-stacked">

					</div>
				</div>
			</div>
		</div>
		<div class="blog-actions">
			<button data-size="s" class="ladda-button button primary" role="submit" data-style="expand-right">
				<span class="ladda-label">Publish</span>
			</button>
			<button data-size="s" class="ladda-button button" role="submit" data-style="expand-right">
				<span class="ladda-label">Save Draft</span>
			</button>
		</div>
	</div>
</div>
{% endblock %}
