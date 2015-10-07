<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}Riverian{% endblock %}</title>
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  {% include "/admin/partials/head" %}
</head>
<body class="{{bodyClasses}} sidebar-visible">
  	<div id="wrapper">

	    <!-- Sidebar -->
	    {% include '/admin/partials/sidebar' %}
	    <!-- /#sidebar-wrapper -->

	    <!-- Page Content -->
	    <div id="page-content-wrapper">
        {% include '/admin/partials/navbar-top' %}
        <div class="container-center">
          <div class="container-fluid" id="notifications">
            {% for error in messages.errors %}
              <div class="alert alert-danger" role="alert">
                {{ error }}
              </div>
            {% endfor %}
          </div>
	        {% block content %}
	        {% endblock %}
        </div>
	    </div>
	    <!-- /#page-content-wrapper -->

	</div>
	<!-- /#wrapper -->
	<script src="/admin/static/scripts/jquery.js"></script>
	<script src="/admin/static/scripts/main.js"></script>
</body>
</html>
