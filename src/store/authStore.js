import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

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

        const state = get();
        const mockUser = Object.values(MOCK_USERS).find(u => u.email === email);
        const registeredUser = state.registeredUsers.find(u => u.email === email);
        
        const foundUser = mockUser || registeredUser;
        
        if (foundUser) {
          const isDemoMatch = mockUser && password === 'password123';
          const isRegisteredMatch = registeredUser && password === registeredUser.password;

          if (isDemoMatch || isRegisteredMatch) {
            const { password: _, ...userWithoutPassword } = foundUser;
            set({ user: userWithoutPassword, loading: false });
            return;
          } else {
            set({ error: 'Incorrect password.', loading: false });
            throw new Error('Incorrect password');
          }
        }

        if (!auth) {
          set({ error: "Email not registered. Please sign up first.", loading: false });
          throw new Error("User not found");
        }
        
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          set({ 
            user: { 
              id: userCredential.user.uid, 
              email: userCredential.user.email,
              name: userCredential.user.displayName || 'User',
              role: 'student' 
            }, 
            loading: false 
          });
        } catch (error) {
          set({ error: 'User not found or incorrect password.', loading: false });
          throw error;
        }
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
          set({ 
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