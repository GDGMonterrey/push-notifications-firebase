import request from 'request';

export default class NotificationService {
	constructor() {
		this.API_KEY = process.env.API_KEY;
	}

	createCondition(topics){
		let condition = "";
		for(let topic of topics){
			if (!condition) {
				condition += `'/topics/${topic}' in topics `;
			} else {
				condition += `|| '/topics/${topic}' in topics `;
			}
		}	
		return condition;
	}

	createNotification(title, text) {
		let notification = {
			title : title,
			body : text,
			sound : "default"
		};
		return notification;
	}

	createMessage(notification, topic, data) {
		let message = {
			notification : notification,
			to : topic,
			data : data
		};
		return message;
	}

	createMultipleMessage(notification, condition, data) {
		let message = {
			notification : notification,
			condition : condition,
			data : data
		}
		return message;
	}

	notificationRequest(message) {
		let pushRequest = {};
		pushRequest.url = 'https://fcm.googleapis.com/fcm/send';
		pushRequest.method = 'POST';
		pushRequest.headers = {
			'Content-Type' : 'application/json',
			'Authorization': `key=${this.API_KEY}`
		};
		pushRequest.body = JSON.stringify(message);
		return pushRequest;
	}

	sendNotification(message) {	
		let pushRequest = this.notificationRequest(message);
		return new Promise((resolve, reject)=>{
			request(pushRequest,(error, response, body) => {
				if (error){
					reject(error);
				} else {
					resolve(body);
				}
			})
		});
	}

	linkToTopicRequest(token, topic) {
		let topicRequest = {}
		topicRequest.url = "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/" + topic;
		topicRequest.method = 'POST';
		topicRequest.headers = {
			'Content-Type' : 'application/json',
			'Content-Length' : 0,
			'Authorization' : `key=${this.API_KEY}`
		};

		return new Promise((resolve, reject)=>{
			request(topicRequest,(error, response, body) => {
				if (error){
					reject(error);
				} else {
					resolve(body);
				}
			})
		});
	}
}