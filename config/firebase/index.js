import firebaseApp from 'firebase/app';
import 'firebase/auth';

// TODO: JSON.parse from env variable
const firebaseConfig = {
  apiKey: 'AIzaSyCFWWR9o1f9uVsnXAgpUu1kiV3juL-scH4',
  authDomain: 'clocker-arthurdenner.firebaseapp.com',
  projectId: 'clocker-arthurdenner',
  storageBucket: 'clocker-arthurdenner.appspot.com',
  messagingSenderId: '123828951279',
  appId: '1:123828951279:web:89ba53f058263ce29f231a',
  measurementId: 'G-KSV6RYJ190',
};

export const firebase = firebaseApp.apps.length
  ? firebaseApp.app()
  : firebaseApp.initializeApp(firebaseConfig);

export const persistenceMode = firebaseApp.auth.Auth.Persistence.LOCAL
