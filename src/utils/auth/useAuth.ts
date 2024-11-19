import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import toast from 'react-hot-toast';

interface AuthState {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Authentification Firebase comme dans votre script
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          if (user) {
            // Obtenir le token immédiatement après la connexion
            const token = await user.getIdToken(true);
            console.log('Login successful, token:', token);
            
            set({ user });
            toast.success('Connexion réussie');
            return true;
          }
          
          throw new Error('No user data received');
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = error.message || 'Échec de la connexion';
          set({ error: errorMessage });
          toast.error(errorMessage);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await user.updateProfile({ displayName: name });
          
          // Obtenir le token après l'inscription
          const token = await user.getIdToken(true);
          console.log('Registration successful, token:', token);
          
          set({ user });
          toast.success('Inscription réussie !');
          return true;
        } catch (error: any) {
          console.error('Registration error:', error);
          const errorMessage = error.message || "Échec de l'inscription";
          set({ error: errorMessage });
          toast.error(errorMessage);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null });
          toast.success('Déconnexion réussie');
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Erreur lors de la déconnexion');
        }
      },

      isAuthenticated: () => {
        return get().user !== null;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Écouteur d'état d'authentification
onAuthStateChanged(auth, (user) => {
  useAuth.setState({ user, isLoading: false });
});