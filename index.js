const amqp = require('amqplib');
const express = require('express');
const app = express();
requires('dotenv').config('./');
app.set(express.urlencoded({extended: true}));

const queue = process.env.BASE_QUEUE || 'TaskQueue';

amqp.connect('amqp://localhost', (error, connection) => {
  if (error) {
    throw error;
  }
  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    channel.assertQueue(queue, {
      durable: true
    });

  });
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 15000);
});

app.post('/add', (req, res) => {
	channel.sendToQueue(queue, Buffer.from(req.body.msg));
});

