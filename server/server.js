module.exports = function (options) {
  var path = require('path')
  var express = require('express')
  var cors = require('cors')
  var bodyParser = require('body-parser')
  var Renderer = require('../config/SimpleRenderer')
  var publicPath = !!options.prerender ? "/_assets/" : "//localhost:2993/_assets/"

  console.log(publicPath)
   var renderer = new Renderer({
     scriptUrl: publicPath + 'app.js',
     path: 'main'
   })

  var app = express()

  app.use(cors())
  app.use("/_assets/", express.static(path.join(__dirname, "../dist")))
  app.use("/", express.static(path.join(__dirname, "public")))

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

   app.get('/*', function (req, res) {
     renderer.render(req.path, null, function (err, html) {
       if (err) {
         res.statusCode = 500
         res.contentType= 'text; charset=utf8'
         res.end(err.message)
         return
       }
       res.contentType = 'text/html; charset=utf8'
       res.end(html)
     })
   })

  var port = +(process.env.PORT || options.defaultPort || 8080);
  app.listen(port, function () {
    console.log('Server listening on port ', port);
  })
}
