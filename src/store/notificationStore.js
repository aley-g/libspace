import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotif = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = updated.filter(n => !n.isRead).length;
      return { notifications: updated, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0
    }));
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 })
}));
