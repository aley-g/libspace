import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { useRoomStore } from './store/roomStore';
import { useBookingStore } from './store/bookingStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import MyBookings from './pages/MyBookings';
import AllBookings from './pages/AllBookings';
import ManageRooms from './pages/ManageRooms';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const listenToRooms = useRoomStore(state => state.listenToRooms);
  const listenToBookings = useBookingStore(state => state.listenToBookings);

  useEffect(() => {
    const unsubRooms = listenToRooms();
    const unsubBookings = listenToBookings();

    return () => {
      if (unsubRooms) unsubRooms();
      if (unsubBookings) unsubBookings();
    };
  }, [listenToRooms, listenToBookings]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="all-bookings" element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <AllBookings />
            </ProtectedRoute>
          } />
          <Route path="manage-rooms" element={
            <ProtectedRoute allowedRoles={['facility_manager', 'librarian']}>
              <ManageRooms />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
