const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.makeUppercase = functions.database.ref('/pedidos/{uid}/{pushId}/titulo')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log('Uppercasing', event.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('uppercase').set(uppercase);
    });
	

exports.makeGetOracao = functions.database.ref('/grupoParticipantes/{pushId}/{uid}/prayfor')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
	  const groupUID = event.params.pushId;
	  const userUID = event.params.uid;
      const prayUID = event.data.val();
	  
      //console.log('Uppercasing', event.params.pushId, original);
	  const group = admin.database().ref('/allGrupos/' + groupUID).once('value');
	  const pray = admin.database().ref('/pedidos/' + prayUID).once('value');
	  
	  return Promise.all([pray,group]).then(results => {
		const praysSnapshot = results[0];
		const groupsSnapshot = results[1];
		
		const groups = Object(groupsSnapshot.val());
		const prays = Object(praysSnapshot.val());
		
		const group = {
			nome: groups.nome,
			prayuid: prayUID,
			prays: prays
		}
		console.log('prays', prays);
		
		return admin.database().ref('/oracoes/' + userUID + '/' + groupUID).set(group).then(() => {
			console.log('makeGetOracao Sucess.');
		});
	  });
    });

exports.countprayfor = functions.database.ref('/oracoes/{uid}/{groupId}/prays/{prayId}/prayfor/{prayforId}')
	.onWrite(event => {
		const collectionRef = event.data.ref.parent;
		const countRef = collectionRef.parent.child('prays_count');

		// Return the promise from countRef.transaction() so our function 
		// waits for this async event to complete before it exits.
		return countRef.transaction(current => {
			if (event.data.exists() && !event.data.previous.exists()) {
				return (current || 0) + 1;
			}
			else if (!event.data.exists() && event.data.previous.exists()) {
				return (current || 0) - 1;
			}
		}).then(() => {
			console.log('Counter updated.');
		});
	});
	
exports.countallpray = functions.database.ref('/pedidos/{uid}/{prayId}/prayfor/{prayforId}')
	.onWrite(event => {
		const collectionRef = event.data.ref.parent;
		const countRef = collectionRef.parent.child('prays_count');

		// Return the promise from countRef.transaction() so our function 
		// waits for this async event to complete before it exits.
		return countRef.transaction(current => {
			if (event.data.exists() && !event.data.previous.exists()) {
				return (current || 0) + 1;
			}
			else if (!event.data.exists() && event.data.previous.exists()) {
				return (current || 0) - 1;
			}
		}).then(() => {
			console.log('Counter updated.');
		});
	});
	
exports.countcomentario = functions.database.ref('/pedidos/{uid}/{prayId}/comentarios/{comentarioId}')
	.onWrite(event => {
		const collectionRef = event.data.ref.parent;
		const countRef = collectionRef.parent.child('comentarios_count');

		// Return the promise from countRef.transaction() so our function 
		// waits for this async event to complete before it exits.
		return countRef.transaction(current => {
			if (event.data.exists() && !event.data.previous.exists()) {
				return (current || 0) + 1;
			}
			else if (!event.data.exists() && event.data.previous.exists()) {
				return (current || 0) - 1;
			}
		}).then(() => {
			console.log('Counter updated.');
		});
	});