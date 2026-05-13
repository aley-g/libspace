import { useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { Settings, Plus, Edit2, Trash2, ShieldAlert, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNotificationStore } from '../store/notificationStore';

const ManageRooms = () => {
  const { user } = useAuthStore();
  const { rooms, addRoom, updateRoom, deleteRoom, setRoomStatus } = useRoomStore();
  const { addNotification } = useNotificationStore();

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'study',
    capacity: 4,
    equipment: '',
    imageUrl: ''
  });

  if (user?.role !== 'facility_manager' && user?.role !== 'librarian') {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({ name: '', type: 'study', capacity: 4, equipment: '', imageUrl: '' });
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      equipment: Array.isArray(room.equipment) ? room.equipment.join(', ') : '',
      imageUrl: room.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Room name is required.');
      return;
    }

    const equipmentArray = formData.equipment
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    const roomData = {
      name: formData.name,
      type: formData.type,
      capacity: parseInt(formData.capacity) || 1,
      equipment: equipmentArray,
      imageUrl: formData.imageUrl || null,
    };

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData);
        toast.success(`Room "${formData.name}" updated!`);
      } else {
        await addRoom({ ...roomData, status: 'active' });
        toast.success(`Room "${formData.name}" added successfully!`);
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error(`Error saving room: ${error.message}`);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room? This cannot be undone.")) {
      try {
        await deleteRoom(roomId);
        toast.success("Room deleted.");
      } catch (error) {
        console.error("Delete room error:", error);
        toast.error("Failed to delete room.");
      }
    }
  };

  const handleStatusToggle = (roomId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'maintenance' : 'active';
    setRoomStatus(roomId, newStatus);
    toast.success(`Room status updated to ${newStatus}`);

    if (newStatus === 'maintenance') {
      addNotification({
        type: 'alert',
        message: `Room ${roomId} has been placed under maintenance.`,
        targetRoles: ['librarian', 'facility_manager']
      });
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="text-primary" size={32} />
            Room Configuration
          </h1>
          <p className="text-gray-500 mt-2">Define room capacities, available equipment, and maintenance status.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Space/Seat
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-5 font-semibold text-gray-600">Room Name</th>
              <th className="p-5 font-semibold text-gray-600">Type</th>
              <th className="p-5 font-semibold text-gray-600">Capacity</th>
              <th className="p-5 font-semibold text-gray-600">Equipment</th>
              <th className="p-5 font-semibold text-gray-600">Status</th>
              <th className="p-5 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rooms.map(room => (
              <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 font-medium text-gray-900">{room.name}</td>
                <td className="p-5 capitalize text-gray-600">{room.type}</td>
                <td className="p-5 text-gray-600">{room.capacity} persons</td>
                <td className="p-5 text-gray-500 text-sm max-w-xs truncate" title={Array.isArray(room.equipment) ? room.equipment.join(', ') : ''}>
                  {Array.isArray(room.equipment) ? room.equipment.join(', ') : ''}
                </td>
                <td className="p-5">
                  <button 
                    onClick={() => handleStatusToggle(room.id, room.status)}
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      room.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {room.status === 'active' ? 'Active' : 'Maintenance'}
                  </button>
                </td>
                <td className="p-5 flex justify-end gap-3">
                  <button onClick={() => openEditModal(room)} className="text-gray-400 hover:text-primary transition-colors" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingRoom ? 'Edit Space/Seat' : 'Add New Space/Seat'}</h2>
            
            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Room Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Study Room A"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Room Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="study">Study Room</option>
                    <option value="meeting">Meeting Room</option>
                    <option value="lab">Computer Lab</option>
                    <option value="seat">Individual Seat</option>
                    <option value="reading hall">Reading Hall</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.capacity} 
                    onChange={e => setFormData({...formData, capacity: e.target.value})} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Equipment (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.equipment} 
                  onChange={e => setFormData({...formData, equipment: e.target.value})} 
                  placeholder="Whiteboard, PCs, Projector"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  {editingRoom ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
