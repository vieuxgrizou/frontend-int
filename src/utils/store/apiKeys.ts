import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptData, decryptData } from '../security/encryption';

interface ApiKeyData {
  key: string;
  lastTested?: string;
  isValid?: boolean;
}

interface ApiKeysState {
  keys: Record<string, ApiKeyData>;
  isLoading: boolean;
  setApiKey: (provider: string, key: string) => Promise<void>;
  getApiKey: (provider: string) => Promise<string | null>;
  updateKeyStatus: (provider: string, isValid: boolean) => Promise<void>;
  clearApiKey: (provider: string) => void;
  hasValidKey: (provider: string) => Promise<boolean>;
}

export const useApiKeys = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      keys: {},
      isLoading: false,

      setApiKey: async (provider: string, key: string) => {
        try {
          set({ isLoading: true });
          
          // Validation de base de la clé
          if (!key.trim()) {
            throw new Error('La clé API ne peut pas être vide');
          }

          // Validation spécifique par fournisseur
          switch (provider) {
            case 'openai':
              if (!key.trim().startsWith('sk-')) {
                throw new Error('Format de clé OpenAI invalide. Doit commencer par sk-');
              }
              break;
            case 'anthropic':
              if (!key.trim().startsWith('sk-ant-')) {
                throw new Error('Format de clé Anthropic invalide. Doit commencer par sk-ant-');
              }
              break;
            case 'google':
              if (!key.trim().match(/^[A-Za-z0-9-_]{39}$/)) {
                throw new Error('Format de clé Google invalide');
              }
              break;
            // Ajoutez d'autres validations spécifiques aux fournisseurs ici
          }

          // Chiffrer la clé avant le stockage
          const encryptedKey = await encryptData(key.trim());
          
          set((state) => ({
            keys: {
              ...state.keys,
              [provider]: {
                key: encryptedKey,
                lastTested: new Date().toISOString(),
                isValid: undefined
              }
            }
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      getApiKey: async (provider: string) => {
        const state = get();
        const keyData = state.keys[provider];
        
        if (!keyData?.key) return null;
        
        try {
          const key = await decryptData(keyData.key);
          return key.trim();
        } catch (error) {
          console.error('Failed to decrypt API key:', error);
          return null;
        }
      },

      updateKeyStatus: async (provider: string, isValid: boolean) => {
        set((state) => ({
          keys: {
            ...state.keys,
            [provider]: {
              ...state.keys[provider],
              isValid,
              lastTested: new Date().toISOString()
            }
          }
        }));
      },

      clearApiKey: (provider: string) => {
        set((state) => {
          const newKeys = { ...state.keys };
          delete newKeys[provider];
          return { keys: newKeys };
        });
      },

      hasValidKey: async (provider: string) => {
        const state = get();
        const keyData = state.keys[provider];
        
        if (!keyData?.key) return false;
        
        // Si la clé n'a jamais été testée ou a été testée il y a plus de 24h
        if (!keyData.lastTested || !keyData.isValid || 
            new Date().getTime() - new Date(keyData.lastTested).getTime() > 24 * 60 * 60 * 1000) {
          return false;
        }
        
        return keyData.isValid;
      }
    }),
    {
      name: 'api-keys-storage',
      partialize: (state) => ({ keys: state.keys })
    }
  )
);