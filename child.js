var xml2js = require('xml2js')
var parser = new xml2js.Parser()

setTimeout(function () {
  process.exit()
}, 3000)

process.on('message', function (dataFromParent) {
  parser.on('end', function(jsonized) {
    process.send(jsonized)
  })

  parser.parseString(dataFromParent.xml)
})
