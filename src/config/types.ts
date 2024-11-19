import type { FirebaseOptions } from 'firebase/app';

export interface AppConfig {
  apiUrl: string;
  firebase: FirebaseOptions;
}

export interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}