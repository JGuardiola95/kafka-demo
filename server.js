const express = require("express");
let WebSocketServer = require('websocket').server;
require('dotenv').config()
const path = require('path');


const kafkaConsumer = require("./kafka/consumer")

const app = express();

app.get('/public/index.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.js'));
});

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
})

let server = app.listen(3000, () => console.log("App listening on port 3000!"));
wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  let connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      // connection.sendBytes(message.binaryData);
    }
  });

  kafkaConsumer(connection)
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

module.exports = app