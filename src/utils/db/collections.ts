import { collection } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Define all Firestore collections
export const usersCollection = collection(db, 'users');
export const sitesCollection = collection(db, 'sites');
export const personasCollection = collection(db, 'personas');