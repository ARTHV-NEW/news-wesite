import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCXP78DoutpD4IO3NDt6Zgdn8SpswnMLhs",
  authDomain: "news-88fb3.firebaseapp.com",
  projectId: "news-88fb3",
  storageBucket: "news-88fb3.firebasestorage.app",
  messagingSenderId: "781444587120",
  appId: "1:781444587120:web:54d0fd5345948bb2df9eb5",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

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
