import { addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { WordPressSite } from '@/types';
import { sitesCollection } from './collections';

export async function getSites(): Promise<WordPressSite[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const q = query(sitesCollection, where('userId', '==', user.uid));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WordPressSite[];
}

export async function createSite(site: Omit<WordPressSite, 'id'>): Promise<WordPressSite> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docRef = await addDoc(sitesCollection, {
    ...site,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return {
    id: docRef.id,
    ...site
  } as WordPressSite;
}

export async function updateSite(id: string, site: Partial<WordPressSite>): Promise<void> {
  const siteRef = doc(db, 'sites', id);
  await updateDoc(siteRef, {
    ...site,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteSite(id: string): Promise<void> {
  const siteRef = doc(db, 'sites', id);
  await deleteDoc(siteRef);
}