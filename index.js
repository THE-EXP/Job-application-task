const amqp = require('amqplib');
const express = require('express');
const app = express();
require('dotenv').config('./');
app.set(express.urlencoded({extended: true}));

const queue = process.env.BASE_QUEUE || 'TaskQueue';
const mainPort = process.env.MAIN_SERVER_PORT || 8000;

async function sendMessage(req){
	amqp.connect('amqp://localhost', (error0, connection) => {
		if (error0) {
			throw error0;
		}
		connection.createChannel((error1, channel) => {
			if (error1) {
				throw error1;
			}

			channel.assertQueue(queue, {
				durable: true
			});

			channel.sendToQueue(queue, Buffer.from(req.body.msg));

		});
		setTimeout(() => {
			connection.close();
			process.exit(0);
		}, 15000);
	});
}

app.post('/add', async (req, res) => {
	await sendMessage(req);
	res.send("message sent!").status(200);
});

app.listen(mainPort, ()=>{console.log("Server started on port", mainPort);});