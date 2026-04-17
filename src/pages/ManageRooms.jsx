import { useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { Edit2, Plus, Trash2, ShieldAlert, CheckCircle, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const ManageRooms = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, setRoomStatus } = useRoomStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const initialFormState = {
    name: '',
    type: 'study',
    capacity: 4,
    equipment: '',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setFormData({
      ...room,
      equipment: room.equipment.join(', ')
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentRoom(null);
    setFormData(initialFormState);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const equipmentArray = formData.equipment.split(',').map(item => item.trim()).filter(Boolean);
    
    const roomData = {
      ...formData,
      equipment: equipmentArray,
      capacity: parseInt(formData.capacity, 10) || 1
    };

    if (currentRoom) {
      updateRoom(currentRoom.id, roomData);
      toast.success('Room updated successfully');
    } else {
      addRoom(roomData);
      toast.success('Room added successfully');
    }
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      deleteRoom(id);
      toast.success('Room deleted');
    }
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'maintenance' : 'active';
    setRoomStatus(id, newStatus);
    toast.success(`Room status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-gray-500 mt-1">Configure library spaces and maintenance schedules.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Add New Room
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {currentRoom ? 'Edit Room' : 'Add New Room'}
            </h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Study Room A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                >
                  <option value="study">Study Room</option>
                  <option value="meeting">Meeting Room</option>
                  <option value="lab">Computer Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment (comma separated)</label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g., Whiteboard, Projector"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Room
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Room Details</th>
                  <th className="px-6 py-4">Type & Capacity</th>
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {room.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="capitalize">{room.type}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{room.capacity} persons</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate" title={room.equipment.join(', ')}>
                        {room.equipment.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(room.id, room.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          room.status === 'active' 
                            ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {room.status === 'active' ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
                        {room.status === 'active' ? 'Active' : 'Maintenance'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
