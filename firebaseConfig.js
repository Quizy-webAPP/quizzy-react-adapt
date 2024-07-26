// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./school-management-e7a71-firebase-adminsdk-8dn9n-dbc0b4ca7b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://school-management-e7a71.appspot.com'
});

const bucket = admin.storage().bucket();
module.exports = bucket;
