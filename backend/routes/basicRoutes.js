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

let payload = {
	data : {
		pendientes: "Al chile no quiero hacerlo"
	}
}
/*let token = "fqV7KdbFHtw:APA91bFFnCT7tNSMl-zYLQ6kfxqQG8iAe2SNDN1kpbVdcjaVl5hSU2bkfYrYTxp3ls8zCOPgVcjURyWDGTv65uMjKmDIDJwNWd4C2xtaEJntHEWNyYugLwaBFXJXMH_AsRhVq3BI9V9I";
notificationService.linkToTopicRequest(token,"nodejs")
	.then(console.log)
	.catch((error)=>{
		console.log(error);
		console.log(error[0]);
	});
/**/
let topic = "nodejs";
firebaseService.sendNotificationToTopic(topic,payload)
	.then((response)=>{
		console.log(response);
	})
	.catch((error)=>{
		console.log(error);
		console.log(error[0]);
	});
basicRoutes.post('/register', (req, res) => {
	if (req.body && req.body.token && req.body.topic ){
		notificationService.linkToTopicRequest(req.body.token, req.body.topic)
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

basicRoutes.post('/multi-message', function(req, res) {
	if (req.body && req.body.topics && req.body.payload ){
		let condition = firebaseService.createCondition(req.body.topics);
		firebaseService.sendToCondition(condition, payload)(req.body.topic, req.body.payload)
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

export default basicRoutes;