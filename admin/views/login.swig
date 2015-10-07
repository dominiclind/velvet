<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}Riverian{% endblock %}</title>
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  {% include "/admin/partials/head" %}
</head>


<body class="login">
  <div class="container-center">
    <div class="card login-box">
      <div class="card-header">
        <h2>Riverian Login</h2>
      </div>
      <div class="card-content">
        <div class="notifications">
          {% for key, val in messages %}
            <div class="notification danger" role="notification">
              <p>{{val}}</p>
            </div>
          {% endfor %}
        </div>
        <form method="post" action="" class="form form-stacked">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" name="username" placeholder="Username" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" name="password" placeholder="Password" />
          </div>
          <div class="form-group">
            <button class="button primary">sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
