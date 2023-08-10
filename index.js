const amqp = require('amqplib');
const express = require('express');
const app = express();
require('dotenv').config('./');
app.set(express.urlencoded({extended: true}));

const queue = process.env.BASE_QUEUE || 'TaskQueue';
const mainPort = process.env.MAIN_SERVER_PORT || 8000;
const RabbitMQURL = process.env.RMQ_URL || 'amqp://localhost:5672';

async function sendMessage(req, res){
	var message = req.query.msg
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
}

app.post('/add', (req, res) => {
	sendMessage(req, res);
	getMessage(req, res);
	/** 
	 * ! Crashes after 2 requests, reason unknown, Node says because i'm trying to set headers when they were already sent to the client, How?
	 * TODO: fix this
	 **/
});

app.listen(mainPort, ()=>{console.log("Server started on port", mainPort);});