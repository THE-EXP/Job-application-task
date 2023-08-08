const amqp = require('amqplib');
require('dotenv').config('./');
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

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});