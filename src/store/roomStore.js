import { create } from 'zustand';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const initialRooms = [
  { id: 'r1', name: 'Study Room A', type: 'study', capacity: 4, equipment: ['Whiteboard', 'Power Outlets'], status: 'active' },
  { id: 'r2', name: 'Study Room B', type: 'study', capacity: 2, equipment: ['Power Outlets'], status: 'active' },
  { id: 'r3', name: 'Meeting Room 1', type: 'meeting', capacity: 10, equipment: ['Projector', 'Whiteboard', 'Video Conferencing'], status: 'active' },
  { id: 'r4', name: 'Computer Lab Alpha', type: 'lab', capacity: 20, equipment: ['PCs', 'Dual Monitors', 'High-Speed Internet'], status: 'maintenance' },
];

export const useRoomStore = create((set, get) => ({
  rooms: [],
  listenToRooms: () => {
    const roomsRef = collection(db, 'rooms');
    
    // Check if empty, if so, seed initial data
    getDocs(roomsRef).then(snapshot => {
      if (snapshot.empty) {
        initialRooms.forEach(room => {
          setDoc(doc(db, 'rooms', room.id), room);
        });
      }
    }).catch(console.error);

    const unsubscribe = onSnapshot(roomsRef, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      set({ rooms: roomsData });
    });

    return unsubscribe;
  },
  
  addRoom: async (room) => {
    const id = Date.now().toString();
    await setDoc(doc(db, 'rooms', id), { ...room, id });
  },
  
  updateRoom: async (id, updatedData) => {
    await updateDoc(doc(db, 'rooms', id), updatedData);
  },
  
  deleteRoom: async (id) => {
    await deleteDoc(doc(db, 'rooms', id));
  },
  
  setRoomStatus: async (id, status) => {
    await updateDoc(doc(db, 'rooms', id), { status });
  },
}));
