import {initializeApp, getApps, getApp, FirebaseApp} from 'firebase/app';
import {getAuth, Auth} from 'firebase/auth';
import {getFirestore, Firestore} from 'firebase/firestore';
import { useAuth as useFirebaseAuth, useFirestore as useFirebaseFirestore, useFirebaseApp as useFirebaseAppProvider } from './provider';

const firebaseConfig = {
  "projectId": "studio-8404860129-9b958",
  "appId": "1:323607538879:web:d5962a6d934be931cdaa0a",
  "apiKey": "AIzaSyAWASR0wY5tB6PzfD7bqJ6WLY4-0s1ILyk",
  "authDomain": "studio-8404860129-9b958.firebaseapp.com",
  "messagingSenderId": "323607538879"
};


type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

let firebaseServices: FirebaseServices | null = null;

function initializeFirebase(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  firebaseServices = { app, auth, firestore };
  return firebaseServices;
}

export { initializeFirebase };
export * from './provider';
export const useAuth = useFirebaseAuth;
export const useFirestore = useFirebaseFirestore;
export const useFirebaseApp = useFirebaseAppProvider;