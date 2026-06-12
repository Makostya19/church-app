import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminSidebar from './components/common/AdminSidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import PrayerRequests from './pages/PrayerRequests';
import Ministries from './pages/Ministries';
import MinistryDetail from './pages/MinistryDetail';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAIImage from './pages/admin/AdminAIImage';
import AdminPrayerRequests from './pages/admin/AdminPrayerRequests';
import AdminMinistries from './pages/admin/AdminMinistries';
import AdminResources from './pages/admin/AdminResources';
import AdminReviews from './pages/admin/AdminReviews';

const GOOGLE_CLIENT_ID = '126862477857-4tcm2ar4i529m8758s0k58dhndtk2813.apps.googleusercontent.com';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/ministries/:id" element={<MinistryDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/prayer-requests" element={<ProtectedRoute><PrayerRequests /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute adminOnly><AdminLayout><AdminEvents /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute adminOnly><AdminLayout><AdminAnnouncements /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/ai" element={<ProtectedRoute adminOnly><AdminLayout><AdminAIImage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/prayer-requests" element={<ProtectedRoute adminOnly><AdminLayout><AdminPrayerRequests /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/ministries" element={<ProtectedRoute adminOnly><AdminLayout><AdminMinistries /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/resources" element={<ProtectedRoute adminOnly><AdminLayout><AdminResources /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute adminOnly><AdminLayout><AdminReviews /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;