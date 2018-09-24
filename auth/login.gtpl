<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Quizzer login</title>
</head>
<body>
    <form action="/login_check" method="post">
        Username:<input type="text" name="username">
        Password:<input type="password" name="password">
        <input type="submit" value="Login">
    </form>
</body>
</html>