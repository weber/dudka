---
to: <%=name%>/src/index.html
---
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title><%=title%></title>
  <base href="/">
  <script type="text/javascript">
    (function() {
      var baseElement = document.getElementsByTagName('base')[0];
      baseElement.setAttribute("href", window.location.pathname);
    }());

  </script>
  <link rel="manifest" href="manifest.json">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content='#35547b'/>
  <link rel="icon" type="image/png" href="logo.png" />
</head>
<body>
  <app-root></app-root>
</body>
</html>
