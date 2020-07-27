let kafka = require('kafka-node');

module.exports = (wssConection) => {
  let Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({
      kafkaHost: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`
    }),
    consumer = new Consumer(
      client, [{
        topic: 'test',
        partition: 0
      }], {
        autoCommit: false
      });
  consumer.on('message', function (message) {
    // console.log("MESSAGE FROM PRODUCER",message);
    wssConection.sendUTF(message.value);
  });
}