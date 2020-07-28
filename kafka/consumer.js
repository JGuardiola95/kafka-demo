let kafka = require('kafka-node');

module.exports = (wssConection) => {
  let topicName = 'test'
  let Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({
      kafkaHost: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`
    }),
    consumer = new Consumer(
      client, [{
        topic: topicName,
        partition: 0,
        offset: 140
      }], {
        autoCommit: false,
        fromOffset: true
      });
  consumer.on('message', function (message) {
    console.log("MESSAGE", message)
    // console.log("MESSAGE FROM PRODUCER",message);
    wssConection.sendUTF(message.value);
  });
}