import firebaseApp from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);

export const firebase = firebaseApp.apps.length
  ? firebaseApp.app()
  : firebaseApp.initializeApp(firebaseConfig);

export const getIdToken = () => firebaseApp.auth().currentUser?.getIdToken();

export const persistenceMode = firebaseApp.auth.Auth.Persistence.LOCAL;
