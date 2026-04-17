import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialRooms = [
  { id: 'r1', name: 'Study Room A', type: 'study', capacity: 4, equipment: ['Whiteboard', 'Power Outlets'], status: 'active' },
  { id: 'r2', name: 'Study Room B', type: 'study', capacity: 2, equipment: ['Power Outlets'], status: 'active' },
  { id: 'r3', name: 'Meeting Room 1', type: 'meeting', capacity: 10, equipment: ['Projector', 'Whiteboard', 'Video Conferencing'], status: 'active' },
  { id: 'r4', name: 'Computer Lab Alpha', type: 'lab', capacity: 20, equipment: ['PCs', 'Dual Monitors', 'High-Speed Internet'], status: 'maintenance' },
];

export const useRoomStore = create(
  persist(
    (set, get) => ({
      rooms: initialRooms,
      
      addRoom: (room) => set((state) => ({ 
        rooms: [...state.rooms, { ...room, id: Date.now().toString() }] 
      })),
      
      updateRoom: (id, updatedData) => set((state) => ({
        rooms: state.rooms.map(room => room.id === id ? { ...room, ...updatedData } : room)
      })),
      
      deleteRoom: (id) => set((state) => ({
        rooms: state.rooms.filter(room => room.id !== id)
      })),
      
      setRoomStatus: (id, status) => set((state) => ({
        rooms: state.rooms.map(room => room.id === id ? { ...room, status } : room)
      })),
    }),
    {
      name: 'room-storage',
    }
  )
);
