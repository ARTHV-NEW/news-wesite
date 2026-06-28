import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

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
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-pulsenews-1ac12794-fb44-4e4e-bd47-c252f05ae3a5");

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
