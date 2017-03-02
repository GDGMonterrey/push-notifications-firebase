import express from 'express';
import { NotificationService, FirebaseService } from '../fire-push';
import dotenv from 'dotenv';
dotenv.load();

const firebaseService = new FirebaseService();
const notificationService = new NotificationService();
const basicRoutes = express.Router();

basicRoutes.get('/', function(req, res) {
	res.json({ version : "1.0.0" });
});

basicRoutes.post('/register', (req, res) => {
	if (req.body && req.body.token && req.body.topic ){
		notificationService.linkToTopicRequest(req.body.token, req.body.topic);
		res.sendStatus(200);
	} else {
		res.sendStatus(500);
	}
});

basicRoutes.post('/device-message', (req, res) => {
	if (req.body && req.body.tokens && req.body.payload){
		firebaseService.sendNotificationToDevice(req.body.tokens, req.body.payload)
			.then((response)=>{
				res.json(response);
			})
			.catch((error)=>{
				res.json(error);
			});
	} else {
		res.sendStatus(500);
	}
});

basicRoutes.post('/topic-message', (req, res) => {
	if (req.body && req.body.topic && req.body.payload ){
		firebaseService.sendNotificationToTopic(req.body.topic, req.body.payload)
			.then((response)=>{
				res.json(response);
			})
			.catch((error)=>{
				res.json(error);
			});
	} else {
		res.sendStatus(500);
	}
});

basicRoutes.post('/topic-message-queue', (req, res) => {
	if (req.body && req.body.topic && req.body.payload ){
		let message = {
			to : "/topics/"+req.body.topic,
			data : req.body.payload.data || req.body.payload
		}
		notificationService.sendNotification(message);
		res.sendStatus(200);
	} else {
		res.sendStatus(500);
	}
});

export default basicRoutes;