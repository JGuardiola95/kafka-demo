let kafka = require('kafka-node');

module.exports = (wssConection) => {
  // console.log("WSS CONNECTION", wssConection)
  let topicName = 'test'
  let Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({
      kafkaHost: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`
    }),
    consumer = new Consumer(
      client, [{
        topic: topicName,
        partition: 0,
        offset: 200
      }], {
        autoCommit: false,
        fromOffset: true
      });
  consumer.on('message', function (message) {
    console.log("MESSAGE", message)
    // wssConection.clients.forEach((client) => {
    //   client.send(message.value);
    // });
    // console.log("MESSAGE FROM PRODUCER",message);
    wssConection.sendUTF(message.value);
  });
}