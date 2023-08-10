var amqp = require('amqplib');
require('dotenv').config('./');

const queue = process.env.BASE_QUEUE || 'TaskQueue';
const RabbitMQURL = process.env.RMQ_URL || 'amqp://localhost:5672';

start();

async function start() {
  const queue = process.env.BASE_QUEUE_A || 'Forth';
  var connection = await amqp.connect(RabbitMQURL);
	console.log(`Opened connection`)
  var channel = await connection.createChannel();
  var something = await channel.assertQueue(queue, {
    durable: false
  });
	
  console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
  channel.consume(queue, async (msg) => {
    const queue = process.env.BASE_QUEUE_B || 'Back';
    channel.ack(msg);
    if(msg.content.toString() == 'Hello, World!') {
			console.log(`Sending message: "Hello there!", to ${queue}`);
      channel.sendToQueue(queue, Buffer.from('Hello there!'));
    } else if(msg.content.toString() == 'Hello, World! It is I The Postman!') {
			console.log(`Sending message: "Hello there, Postman!", to ${queue}`);
			channel.sendToQueue(queue, Buffer.from('Hello there, Postman!'));
    }
		
		console.log(`Received: ${msg.content.toString()}`);
    }, {noAck: false, consumerTag: 'consumer'});
}