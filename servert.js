const PORT = process.env.PORT || 3000;
const INDEX = 'views/index.html';
const express = require("express")
const kafkaConsumer = require("./kafka/consumer")

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const { Server } = require('ws');

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  kafkaConsumer()
  ws.on('close', () => console.log('Client disconnected'));
})

// kafkaConsumer(wss)

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);