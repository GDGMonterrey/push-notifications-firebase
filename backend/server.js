import express from 'express';
import bodyParser from 'body-parser';
import { basicRoutes } from './routes';

const app = express();
const port = 1337;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	next();
});

app.use('/', basicRoutes);
app.listen(port);
console.log(`Firepush is coming in port ${port}`);