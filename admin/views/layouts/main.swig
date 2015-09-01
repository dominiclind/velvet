<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}Riverian{% endblock %}</title> 
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  {% include "../partials/head.swig" %} 
</head>
<body class="{{bodyClasses}}">
  	<div id="wrapper">
		<nav class="navbar navbar-default navbar-fixed-top">
		  <div class="container-fluid">
		    <div class="navbar-header">
		      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
		        <span class="sr-only">Toggle navigation</span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		      </button>
		      <span class="navbar-brand">r<i class="ion-flash"></i>verian</span>
		    </div>
		    <div id="navbar" class="navbar-collapse collapse">		      
		      <ul class="nav navbar-nav navbar-right">
		        <!--<li><a href="../navbar/">Default</a></li>
		        <li><a href="../navbar-static-top/">Static top</a></li>
		        <li class="active"><a href="./">Fixed top <span class="sr-only">(current)</span></a></li>-->
		      </ul>
		    </div><!--/.nav-collapse -->
		  </div>
		</nav>
		<!-- /#navbar -->

	    <!-- Sidebar -->
	    <div id="sidebar-wrapper">
	        <ul class="sidebar-nav">
	            <li>
	                <a href="#">Dashboard</a>
	            </li>
	            <li>
	                <a href="#">Shortcuts</a>
	            </li>
	            <li>
	                <a href="#">Overview</a>
	            </li>
	            <li>
	                <a href="#">Events</a>
	            </li>
	            <li>
	                <a href="#">About</a>
	            </li>
	            <li>
	                <a href="#">Services</a>
	            </li>
	            <li>
	                <a href="#">Contact</a>
	            </li>
	        </ul>
	    </div>
	    <!-- /#sidebar-wrapper -->

	    <!-- Page Content -->
	    <div id="page-content-wrapper">
	        {% block content %}
	        {% endblock %}
	    </div>
	    <!-- /#page-content-wrapper -->

	</div>
	<!-- /#wrapper -->
	<script src="/admin/static/scripts/jquery.js"></script>
	<script src="/admin/static/scripts/main.js"></script>
</body>
</html>