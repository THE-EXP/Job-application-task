const amqp = require('amqplib');
const express = require('express');
const app = express();
require('dotenv').config('./');
app.set(express.urlencoded({extended: true}));



const mainPort = process.env.MAIN_SERVER_PORT || 8000;
const RabbitMQURL = process.env.RMQ_URL || 'amqp://localhost:5672';

async function sendMessage(req, res){
	var message = req.query.msg
	const queue = process.env.BASE_QUEUE_A || 'Forth';
	var connection = await amqp.connect(RabbitMQURL);
	console.log('connection opened');
	var channel = await connection.createChannel();
	await channel.assertQueue(queue, {
    durable: false
	});
	
	console.log(`Sending message: ${message}`);
	channel.sendToQueue(queue, Buffer.from(message));
	setTimeout(() => {
		channel.close();
    connection.close();
		console.log('Connection closed')
	},  500);
}

async function getMessage(req, res){
	const queue = process.env.BASE_QUEUE_B || 'Back';
	var connection = await amqp.connect(RabbitMQURL);
	console.log('connection opened');
	var channel = await connection.createChannel();
	channel.assertQueue(queue, {
    durable: false
	});

	channel.consume(queue, (msg) => {
		if (msg.content.toString() !== null){
			res.status(200).send(`Response to sent message: ${msg.content.toString()}`);
		} else if(msg.content.toString() === null) {
			res.status(200).send('No responce sent');
		} else {
			res.status(500).send('Failed to send message');
		}
		console.log(`Received: ${msg.content.toString()}`);
		channel.ack(msg);
	}, {noAck: false, consumerTag: 'sender'});
	setTimeout(() => {
		channel.close();
    connection.close();
		console.log('Connection closed')
	},  500);
}

app.post('/add', async (req, res) => {
		await sendMessage(req, res);
		await getMessage(req, res);
	/** 
	 * * Temporary fix: use 2 queues to separate the send/receive sides so that they don't get their own messages, seems to have fixed both hears problem and the self-read messages
	 **/
});

app.listen(mainPort, ()=>{console.log("Server started on port", mainPort);});