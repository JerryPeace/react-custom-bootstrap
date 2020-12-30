var fs = require('fs')
var path = require('path')
var htmlContainer = {
    'main': fs.readFileSync(path.resolve(__dirname, "../app/index.html"), 'utf-8'),
}

function SimpleRender(options) {
    console.log(options);
    this.html = htmlContainer[options.path].replace('SCRIPT_URL', options.scriptUrl)
}

SimpleRender.prototype.render = function(_path, _readItems, callback) {
  callback(null, this.html)
}

module.exports = SimpleRender
