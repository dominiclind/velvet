<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}Riverian{% endblock %}</title> 
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  {% include "/admin/partials/head" %} 
</head>
<body class="login">
  <div class="container">
    <div class="row">
      <div class="col-md-offset-4 col-md-4 login-col">  

        {% for key, val in messages %}
          <div class="alert alert-danger" role="alert">            
            <p>{{val}}</p>
          </div>          
        {% endfor %} 

        <h2>riverian.</h2>
        <form method="post" action="">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" name="username" placeholder="Username" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" name="password" placeholder="Password" />          
          </div>
          <div class="form-group">
            <button class="btn btn-primary">sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
</html>