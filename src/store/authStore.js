import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';

// For demo purposes, we allow forcing a login with a mock user
const MOCK_USERS = {
  student: { id: 's1', name: 'Student Demo', email: 'student@demo.com', role: 'student' },
  librarian: { id: 'l1', name: 'Librarian Demo', email: 'librarian@demo.com', role: 'librarian' },
  manager: { id: 'm1', name: 'Manager Demo', email: 'manager@demo.com', role: 'facility_manager' },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      registeredUsers: [],
      
      loginMock: (role) => {
        set({ user: MOCK_USERS[role], error: null });
      },

      loginWithEmail: async (email, password) => {
        set({ loading: true, error: null });
        
        await new Promise(resolve => setTimeout(resolve, 600));

        // 1. Always intercept Mock/Demo accounts
        const mockUser = Object.values(MOCK_USERS).find(u => u.email === email);
        if (mockUser) {
          if (password === 'password123') {
            set({ user: mockUser, loading: false });
            return;
          } else {
            set({ error: 'Incorrect password for demo account.', loading: false });
            throw new Error('Incorrect password');
          }
        }

        // 2. Try real Firebase Auth first
        if (auth) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Look up the local cache for name and role since Firebase might not have displayName set
            const state = get();
            const localUser = state.registeredUsers.find(u => u.email === email);
            const userName = localUser?.name || userCredential.user.displayName || 'User';
            const userRole = localUser?.role || 'student';

            set({ 
              user: { 
                id: userCredential.user.uid, 
                email: userCredential.user.email,
                name: userName,
                role: userRole 
              }, 
              loading: false 
            });
            return; // Success!
          } catch (err) {
            // If Firebase fails, we'll let it fall through to check local storage
            console.log("Firebase auth failed, checking local storage fallback.", err.message);
          }
        }

        // 3. Fallback to local storage (for accounts created before Firebase was active)
        const state = get();
        const registeredUser = state.registeredUsers.find(u => u.email === email);
        
        if (registeredUser) {
          if (password === registeredUser.password) {
            const { password: _, ...userWithoutPassword } = registeredUser;
            set({ user: userWithoutPassword, loading: false });
            return;
          }
        }

        set({ error: 'User not found or incorrect password.', loading: false });
        throw new Error('Auth failed');
      },

      registerWithEmail: async (name, email, password, role = 'student') => {
        set({ loading: true, error: null });
        
        await new Promise(resolve => setTimeout(resolve, 600));

        const state = get();
        const emailExists = Object.values(MOCK_USERS).some(u => u.email === email) || 
                            state.registeredUsers.some(u => u.email === email);

        if (emailExists) {
          set({ error: 'This email is already registered.', loading: false });
          throw new Error('Email already exists');
        }

        if (!auth) {
          const newUser = {
            id: `local_${Date.now()}`,
            name,
            email,
            password,
            role
          };
          
          set({ 
            registeredUsers: [...state.registeredUsers, newUser],
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
            loading: false 
          });
          return;
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          try {
            await updateProfile(userCredential.user, { displayName: name });
          } catch (err) {
            console.error("Failed to update Firebase profile name", err);
          }
          
          // Cache the user locally so we can validate their existence later for realistic error throwing
          const newUser = {
            id: userCredential.user.uid,
            name,
            email,
            password, // We store this locally just to simulate backend checks for the presentation
            role
          };

          set({ 
            registeredUsers: [...state.registeredUsers, newUser],
            user: { 
              id: userCredential.user.uid, 
              email: userCredential.user.email,
              name: name,
              role: role 
            }, 
            loading: false 
          });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      resetPassword: async (email) => {
        set({ loading: true, error: null });
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

        // 1. Check if email actually exists in our local cache or mock users
        // This is necessary because Firebase natively returns success for fake emails to prevent enumeration attacks!
        // We bypass that here so the presentation shows realistic errors.
        const state = get();
        const emailExists = Object.values(MOCK_USERS).some(u => u.email === email) || 
                            state.registeredUsers.some(u => u.email === email);
                            
        if (!emailExists) {
          set({ loading: false });
          const error = new Error('User not found');
          error.code = 'auth/user-not-found';
          throw error;
        }

        if (!auth) {
          set({ error: "Email service not configured.", loading: false });
          throw new Error("Auth not configured");
        }
        
        try {
          await sendPasswordResetEmail(auth, email);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      logout: async () => {
        if (auth) {
          try {
            await signOut(auth);
          } catch (error) {
            console.error("Firebase signout error", error);
          }
        }
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
