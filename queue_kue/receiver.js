const kue = require('kue');
const queue = kue.createQueue();
const request = require('request');

queue.process('firebase_queue', function(job, done) {  
    request(job.data ,(err, response, body) => {
		if (err){
			return done(err);
		}else {
			console.log("job done :)");
			done();
		}
	});	   
});