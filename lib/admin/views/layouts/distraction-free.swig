<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}Riverian{% endblock %}</title>
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  {% include "/admin/partials/head" %}
</head>
<body class="{{bodyClasses}} distraction-free">
  	<div id="wrapper">
      <div class="container-center">
	        {% block content %}
	        {% endblock %}
	    </div>
	</div>
	<!-- /#wrapper -->
	<script src="/admin/static/scripts/jquery.js"></script>
	<script src="/admin/static/scripts/main.js"></script>
</body>
</html>
