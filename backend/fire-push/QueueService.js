import * as amq_api from 'amqplib/callback_api';
import kue from 'kue';
const queue = kue.createQueue();

const sendMessageRabbitMQ = function (data) {
	amq_api.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, channel) {
			let queue = 'firebase_queue';
			let configQueue = {
				durable: false,
				timestamp: Date.now(),
				contentEncoding: 'utf-8'
			};
			channel.assertQueue(queue, configQueue);
			channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
			console.log("Message sended");
		});
	});
}

const sendMessageKUE = function (data) {
	queue
		.create('firebase_queue', data)
		.priority('normal')
		.attempts(5)
		.save();
}

export default {
	sendMessage : function(data){
		if (process.env.use_rabbit){
			sendMessageRabbitMQ(data);
		} else {
			sendMessageKUE(data);
		}
	}
}