const admin = require('firebase-admin');
const serviceAccount = require('./school-management-e7a71-firebase-adminsdk-8dn9n-dbc0b4ca7b.json');

// Initialize Firebase only if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'school-management-e7a71.appspot.com', // Corrected to the bucket name
  });
}

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

module.exports = { bucket, firestore };
