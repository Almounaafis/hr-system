import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      requiresOTP: false,
      pendingEmail: null,
      login: ({ user, token, requiresOTP }) => set({ isAuthenticated: true, user, token, requiresOTP }),
      logout: () => set({ isAuthenticated: false, user: null, token: null, requiresOTP: false, pendingEmail: null }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
    }),
    {
      name: 'auth-storage',
      // ✅ Security: exclude token from localStorage — token lives in Cookie only
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        requiresOTP: state.requiresOTP,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
);

export default useAuthStore;
