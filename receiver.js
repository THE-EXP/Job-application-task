var amqp = require('amqplib');
require('dotenv').config('./');

const queue = process.env.BASE_QUEUE || 'TaskQueue';
const RabbitMQURL = process.env.RMQ_URL || 'amqp://localhost';

start();

async function start() {
  var connection = await amqp.connect(RabbitMQURL);
	console.log(`Opened connection`)
  var channel = await connection.createChannel();
  channel.assertQueue(queue, {
    durable: false
  });
	
  console.log(` [*] Waiting for messages in ${queue} . To exit press CTRL+C`);
  channel.consume(queue, async (msg) => {
		channel.ack(msg);
    if(msg.content.toString() == 'Hello, World!') {
			console.log(`Sending message: "Hello there!"`);
      channel.sendToQueue(queue, Buffer.from('Hello there!'));
    } else if(msg.content.toString() == 'Hello, World! It is I The Postman!') {
			console.log(`Sending message: "Hello there, Postman!"`);
			channel.sendToQueue(queue, Buffer.from('Hello there, Postman!'));
    }
		console.log(`Received: ${msg.content.toString()}`);
    }, {noAck: false, consumerTag: 'consumer'});
}