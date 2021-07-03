import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CERT);
const credential = admin.credential.cert(serviceAccount);

export const app = firebaseServer.apps.length
  ? firebaseServer.app()
  : admin.initializeApp({ credential });

