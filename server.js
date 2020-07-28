require('dotenv').config()
const express = require("express")
const Vue = require('vue')
// const renderer = require('vue-server-renderer').createRenderer()
const createApp = require('./app/app')
const path = require('path')
const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('vue-server-renderer').createRenderer({
  template,
});
let WebSocketServer = require('websocket').server


const kafkaConsumer = require("./kafka/consumer")
const { create } = require('domain')

const server = express()

server.get('/public/index.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.js'))
})

server.get('/', (req, res) => {
  console.log("ROOT")
  res.sendFile(process.cwd() + '/views/index.html')
})

// server.get('/test', (req, res) => {
//   console.log('TESTING asid')
//   res.send('hello test')
// })

server.get('/test', (req, res) => {
  const context = {
    title: 'KAFKA DEMO',
    meta: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
    url: req.url
  };
  const app = createApp(context)

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      console.log("SERV ERROR", err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

let wsServer = server.listen(process.env.PORT || 3000, () => console.log("app listening on port 3000!"))
wsServer = new WebSocketServer({
  httpServer: wsServer,
  autoAcceptConnections: false
})

wsServer.on('request', function (request) {

  let connection = request.accept('echo-protocol', `${request.origin}:${process.env.PORT}`)
  console.log("REQUEST OROGIN", `${request.origin}:${process.env.PORT}`)
  console.log((new Date()) + ' Connection accepted.')

  kafkaConsumer(connection)
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

module.exports = server