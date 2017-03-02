const amq_api = require('amqplib/callback_api');
const request = require('request');

const createConsumer = function (channel) {
	return function (message) {
		let content = message.content.toString('utf-8');
		console.log(" Message in queue %s", content);
		let requestOptions = null;
		requestOptions = JSON.parse(content);
		request(requestOptions,(err, response, body) => {
			console.log(err)
		});	
	}
};

const createChannelCallback = function (err, channel) {
	let queue = 'firebase_queue';
    channel.assertQueue(queue, { durable: false });
    
    let consumeMessages = createConsumer(channel);
    channel.consume(queue, consumeMessages, {noAck: true});
    console.log("Up & Ready to the battle");
}

const connectQueueCallback = function(err, conn) {
	conn.createChannel(createChannelCallback);
}

amq_api.connect('amqp://localhost', connectQueueCallback);