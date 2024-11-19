import { create } from 'zustand';

interface AppState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useStore = create<AppState>((set) => ({
  language: navigator.language.split('-')[0] || 'en',
  setLanguage: (language: string) => set({ language })
}));