import { collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import * as users from './db/users';
import * as sites from './db/sites';
import * as personas from './db/personas';

// Collections
export const usersCollection = collection(db, 'users');
export const sitesCollection = collection(db, 'sites');
export const personasCollection = collection(db, 'personas');

// Export services
export const userDb = users;
export const siteDb = sites;
export const personaDb = personas;

// Export db instance
export { db };