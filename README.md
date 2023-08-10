# Job application task
 
This Project will show the interaction of 2 microservices using RabbitMQ as the MQTT exchange

# Dependencies
## RabbitMQ and Erlang
- RabbitMQ available [here](https://www.rabbitmq.com/download.html)
- Erlang available [here](https://www.erlang.org/downloads)
## Node.js
- Node.js(LTS) available [here](https://nodejs.org/en/download)
## Node modules
- Bundled with the project
### Modules list
- amqplib (amqplib-node)
- express (Express.js)
- dotenv (.env)

# Short Video explaination
[Video explaination](Video/lv_0_20230810153640.mp4)

# Text explaination
Run ```npm run micro1``` in one terminal and ```npm run micro2``` in another, then use Postman with provided collection or run ```curl -X POST http://localhost:8000/add?msg=Hello%2C%20World%21``` in another terminal and see it get a response "Response to sent message: Hello there!"
now switch the flags on msg keys in the query or in the same terminal try running ```curl -X POST http://localhost:8000/add?msg=Hello%2C%20World%21%20It%20is%20I%20The%20Postman%21``` and see it spit-out the response ```Response to sent message: Hello there, Postman!```