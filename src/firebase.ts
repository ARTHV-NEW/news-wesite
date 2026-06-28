import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "jittery-nation-f5xj8",
  appId: "1:533900522181:web:48fbca6339748e877af6ac",
  apiKey: "AIzaSyCQHA1945tPYfa2pJC3eoowRa_OLkIF4i0",
  authDomain: "jittery-nation-f5xj8.firebaseapp.com",
  storageBucket: "jittery-nation-f5xj8.firebasestorage.app",
  messagingSenderId: "533900522181",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
// Need to add databaseId if we are using the named database, let's just initialize it with default if we can, but wait, firestoreDatabaseId is provided: "ai-studio-pulsenews-1ac12794-fb44-4e4e-bd47-c252f05ae3a5"
// Actually, firebase v10 `getFirestore` accepts a db named instance or just use initializeFirestore if default? No, wait. 
// We should check how to initialize named firestore in web SDK. 
// getFirestore(app, "ai-studio-pulsenews-1ac12794-fb44-4e4e-bd47-c252f05ae3a5")

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-pulsenews-1ac12794-fb44-4e4e-bd47-c252f05ae3a5");
