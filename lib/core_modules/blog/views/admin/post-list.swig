{% extends '/admin/layouts/main' %}


{% block content %}
    <div class="page-header">
      <div class="page-header-content">
          <h4 class="page-title"><b>Blog</b> - List</h4>
      </div>
    </div>
    <div class="page-content">
      <div class="card">
        <table>
          <thead>
  		      <th width="30%">Title</th>
  		      <th width="20%">Author</th>
  		      <th width="20%">Categories</th>
  		      <th width="24%">Tags</th>
  		      <th width="3%"></th>
  		      <th width="3%"></th>
          </thead>
          <tbody>
					  	{% for post in posts %}
						    <tr>
  								<td>{{ post.title }}</td>
  								<td><a href="#">{{ post.author.username }}</a></td>
  								<td>cat, another one</td>
  								<td>{% for tag in post.tags %} <a href="#" class="label label-primary">{{tag.name}}</a> {% endfor %}</td>
  								<td><a href="/admin/blog/post/edit/{{post.id}}"><i class="icon ion-edit"></i></a></td>
  								<td><a href="/admin/blog/post/delete/{{post.id}}"><i class="icon ion-trash-b"></i></a></td>
						    </tr>
					    {% endfor %}
        </table>
      </div>
      <div class="actions">
        <a class="button primary" href="/admin/blog/post/new">New</a>
      </div>
    </div>
{% endblock %}
