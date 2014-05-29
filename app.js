var app = connect() // express() for express server
// app.configure(function() { for express server
  .use(modRewrite([
    '^/test$ /index.html',
    '^/test/\\d*$ /index.html [L]',
    '^/test/\\d*/\\d*$ /flag.html [L]'
  ]))
  .use(connect.static(options.base))
  .listen(3000)
// }) for express server