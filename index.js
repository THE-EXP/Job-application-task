const amqp = require('amqplib');
const express = require('express');
const app = express();
require('dotenv').config('./');
app.set(express.urlencoded({extended: true}));

const queue = process.env.BASE_QUEUE || 'TaskQueue';
const mainPort = process.env.MAIN_SERVER_PORT || 8000;
const RabbitMQURL = process.env.RMQ_URL || 'amqp://localhost';

async function sendMessage(message){
	var connection = await amqp.connect(RabbitMQURL, {timeout: 60000});
	var channel = await connection.createChannel(queue);
	channel.assertQueue(queue, {
    durable: false
	});
	channel.sendToQueue(queue, Buffer.from(message));
	channel.close();
	connection.close();
	return true
}

app.post('/add', async (req, res) => {
	var done = await sendMessage(req.query.msg)
	console.log(done);
	if (done){
		res.status(200).send("message sent!");
	} else {
		res.status(500).send('Failed to send message');
	}
});

app.listen(mainPort, ()=>{console.log("Server started on port", mainPort);});