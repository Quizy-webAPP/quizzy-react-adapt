// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-firebase-admin-sdk.json'); // Download this from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://school-management-e7a71.appspot.com', // Firebase storage bucket URL
});

const bucket = admin.storage().bucket();
module.exports = { bucket };
