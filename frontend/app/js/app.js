var API_URL = "<%= API_URL %>";
var messaging;

function getPermisos() {
	messaging.requestPermission()
		.then(function() {
			getToken();
		})
		.catch(function(err) {
			console.log('No tienes permisos :(', err);
		});
}


function getToken() {
	messaging.getToken()
		.then(function(token) {
			console.log(token);
			if (!$("#suscribir").is(":checked")){
				$('#suscribir').prop('checked', true);
			}
		})
		.catch(function(err) {
			$('#suscribir').prop('checked', false);
			console.log('No se pudo obtener token', err);
		});
}

function deleteToken() {
	messaging.getToken()
		.then(function(token) {
			return messaging.deleteToken(currentToken);
		})
		.then(function() {
			console.log('Token borrado');
		})
		.catch(function(err) {
			console.log('No se pudo borrar token', err);
		});
}

function initFirebase() {
	var config = {
		apiKey: "<%= API_KEY %>",
		authDomain: "<%= AUTH_DOMAIN %>",
		databaseURL: "<%= DATABASE_URL %>",
		storageBucket: "<%= STORAGE_BUCKET %>",
		messagingSenderId: "<%= MESSAGING_SENDER_ID %>"
	};
	firebase.initializeApp(config);
	messaging = firebase.messaging();
}

$(document).on("ready", function() {
	initFirebase();
	$("#suscribir").on("click", function(e) {
		if (this.checked){
			getPermisos();
		} else{
			deleteToken();
		}
	});
	getToken();
});
