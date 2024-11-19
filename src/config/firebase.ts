// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCP_ptZDJ9A62D90GTNDKMjX0QVnmTy_hk",
  authDomain: "intensify-api.firebaseapp.com",
  projectId: "intensify-api",
  storageBucket: "intensify-api.appspot.com",
  messagingSenderId: "758001542257",
  appId: "1:758001542257:web:a219515b5db4c077a967d0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
