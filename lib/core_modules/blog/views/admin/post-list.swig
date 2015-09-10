{% extends '/admin/layouts/main' %}


{% block content %}
	<div class="container-fluid" id="notifications">		
		{{ menu('admin') }}
		{% for error in messages.errors %}
			<div class="alert alert-danger" role="alert">
				{{ error }}
			</div>			
		{% endfor %}
	</div>
	<div class="container-fluid">
		<div class="row">
			<component data-sr name="posts-list" class="col-xs-12">				
				<div>
					<div class="row">	
						<div class="col-xs-12">							
							<div class="pull-left"><h2>Posts</h2></div>
							<div class="pull-right search-wrap">
								<div class="input-group">
									<div class="input-group">
									    <div class="input-group-addon"><i class="ion-search"></i></div>
									    <input type="text" class="form-control" id="exampleInputAmount" placeholder="Search">							    
									 </div>							
								</div>
							</div>
						</div>
					</div>
					<div class="row select-actions-row">
						<div class="col-xs-12">
							<div class="input-group select-actions">
								<select class="form-control">
									<option>Action</option>
									<option>Delete</option>
								</select>
							</div>
						</div>
					</div>
					<table class="table">
					  <thead>
					    <tr>
					      <th width="5%"></th>
					      <th width="30%">Title</th>
					      <th width="20%">Author</th>
					      <th width="20%">Categories</th>
					      <th width="15%">Tags</th>	
					      <th width="5%"></th>					      				      
					      <th width="5%"></th>
					    </tr>
					  </thead>
					  <tbody>
					  	{% for post in posts %}
						    <tr>	
								<td><input type="checkbox" /></td>				      
								<td>{{ post.title }}&nbsp;<span class="label label-success">New</span></td>
								<td><a href="#">{{ post.author.firstname }} {{ post.author.lastname }}</a></td>
								
								<td><a href="#" class="label label-primary">Category</a></td>
								<td>{% for tag in post.tags %} <a href="#" class="label label-primary">{{tag.name}}</a> {% endfor %}</td>			
								<td><a href="/admin/blog/post/edit/{{post.id}}"><i class="icon ion-edit"></i></a></td>
								<td><a href="/admin/blog/post/delete/{{post.id}}"><i class="icon ion-trash-b"></i></a></td>
						    </tr>
					    {% endfor %}
					    <!--<tr>					      
							<td><input type="checkbox" /></td>				      
							<td>This is a blog post title</td>
							<td><a href="#">Robert Stenbom</a></td>
							<td><a href="#" class="label label-primary">Tech</a></td>
							<td><a href="#" class="label label-primary">a tag</a> <a class="label label-primary" href="#">another tag</a></td>
							<td><a href="#"><i class="icon ion-edit"></i></a></td>
							<td><a href="#"><i class="icon ion-trash-b"></i></a></td>
					    </tr>-->				    
					  </tbody>
					</table>
				</div>		
				<footer>
					<nav class="pull-left">
					  <ul class="pagination">
					    <li>
					      <a href="#" aria-label="Previous">
					        <span aria-hidden="true">&laquo;</span>
					      </a>
					    </li>
					    <li><a href="#">1</a></li>
					    <li><a href="#">2</a></li>
					    <li><a href="#">3</a></li>
					    <li><a href="#">4</a></li>
					    <li><a href="#">5</a></li>
					    <li>
					      <a href="#" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>
					  </ul>
					</nav>						
					<a class="pull-right btn btn-success" href="/admin/posts/new" role="button">Add new</a>
				</footer>		
			</component>	
		</div>
	</div>

{% endblock %}