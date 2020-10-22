import { initializeApp, credential } from 'firebase-admin'

initializeApp({
	credential: credential.applicationDefault(),
	databaseURL: 'https://hn-comment-bot.firebaseio.com'
})

console.log('Firebase initialised')
