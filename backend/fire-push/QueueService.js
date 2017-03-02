import * as amq_api from 'amqplib/callback_api';

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

export default {
	sendMessage : function(data){
		sendMessageRabbitMQ(data);
	}
}