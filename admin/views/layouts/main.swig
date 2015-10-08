<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>{% block title %}Riverian{% endblock %}</title>
  <meta name="viewport" content="initial-scale=1, maximum-scale=1"> {% include "/admin/partials/head" %}
</head>

<body class="{{bodyClasses}} sidebar-visible">
  <div id="approot">
    <div id="wrapper" class="container">

      <!-- Sidebar -->
      {% include '/admin/partials/sidebar' %}
      <!-- /#sidebar-wrapper -->

      <!-- Page Content -->
      <div id="page-content-wrapper">
        <!-- {% include '/admin/partials/navbar-top' %} -->
        <div class="container">
          {% block content %} {% endblock %}
        </div>
      </div>
      <!-- /#page-content-wrapper -->
    </div>
  </div>
  <!-- /#wrapper -->
</body>

</html>
