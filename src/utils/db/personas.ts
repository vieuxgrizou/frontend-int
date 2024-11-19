import { addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { Persona } from '@/types';
import { personasCollection } from './collections';

export async function getPersonas(): Promise<Persona[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const q = query(personasCollection, where('userId', '==', user.uid));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Persona[];
}

export async function createPersona(persona: Omit<Persona, 'id'>): Promise<Persona> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docRef = await addDoc(personasCollection, {
    ...persona,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return {
    id: docRef.id,
    ...persona
  } as Persona;
}

export async function updatePersona(id: string, persona: Partial<Persona>): Promise<void> {
  const personaRef = doc(db, 'personas', id);
  await updateDoc(personaRef, {
    ...persona,
    updatedAt: new Date().toISOString()
  });
}

export async function deletePersona(id: string): Promise<void> {
  const personaRef = doc(db, 'personas', id);
  await deleteDoc(personaRef);
}