import * as admin from 'firebase-admin';

export default class FirebaseService {
	constructor() {
		this.databaseURL = process.env.DATABASE_URL;
		let serviceAccount = require(process.env.FIREBASE_CREDENTIALS);
		let credentials ={
			credential: admin.credential.cert(serviceAccount),
			databaseURL: this.databaseURL
		};
		admin.initializeApp(credentials);
	}

	sendNotificationToDevice(tokens, payload) {
		return admin.messaging().sendToDevice(tokens, payload);
	}
	
	sendNotificationToTopic(topic, payload) {
		return admin.messaging().sendToTopic(topic, payload);
	}
}