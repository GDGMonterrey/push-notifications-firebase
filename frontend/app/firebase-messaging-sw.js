importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': "<%= MESSAGING_SENDER_ID %>"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	console.log('Llego una notificación push :3', payload);
	var title = 'Hola';
	var options = {
		body: 'Soy una notificación y no te dejaré en visto :)',
		icon: '/img/gdglogo.png'
	};
	self.registration.showNotification(title,options);
});

self.addEventListener('notificationclick', function(event) {
	console.log('Le hicieron click :D');

	event.notification.close();
	event.waitUntil(
		clients.matchAll({
			includeUncontrolled: true,
			type: 'window'
		})
		.then( activeClients => {
			if (activeClients.length > 0) {
				activeClients[0].focus();
			} else {
				clients.openWindow("<%= URL_WINDOW %>");
			}
		})
	);
});