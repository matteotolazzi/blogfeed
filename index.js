var express = require('express')
var request = require('request')
var chalk = require('chalk')
var fork = require('child_process').fork

const blogUrl = 'http://insideout.topshop.com/fashion-week-1/feed?category=fashion-week-1'

var app = express()

app.get('/', function(clientReq, clientRes) {
  console.log(chalk.yellow('Parent received request from client'))

  request({ url: blogUrl }, function (err, res, xmlBlogFeedString) {
    console.log('Parent received response from BlogFeed')

    var child = fork(__dirname + '/child.js')

    console.log(chalk.green('New child', child.pid))

    child.on('message', function (blogFeedJsonParsed) {
      console.log('Received answer from ', child.pid)

      clientRes.send(blogFeedJsonParsed)
      child.kill()
      console.log(chalk.red('killed', child.pid))
    })

    child.on('error', function (error) {
      // The process could not be spawned, or
      // The process could not be killed, or
      // Sending a message to the child process failed.
      console.log('Error for child: ' + child.pid, error)
      child.kill()
    })

    child.on('exit', function (code, signal) {
      console.log('Exit for child ' + child.pid + ' with code ' + code + ' and signal ' + signal)
      child.kill()
    })

    child.send({ xml: xmlBlogFeedString })
  })
})

app.listen(8090, function () {
  console.log('Server running on 8090...')
})
