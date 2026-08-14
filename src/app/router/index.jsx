import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminAuthProvider } from '../../context/AdminAuthContext';
import RequireAdminAuth from '../../components/RequireAdminAuth';
import AdminLogin from '../../pages/AdminLogin';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminWeddingsList from '../../pages/admin/AdminWeddingsList';
import WeddingInvite from '../../pages/WeddingInvite';
import Landing from '../../pages/Landing';
import AdminProfile from '../../pages/admin/AdminProfile';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/weddings"
            element={
              <RequireAdminAuth roles={['admin']}>
                <AdminWeddingsList />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/weddings/:weddingId"
            element={
              <RequireAdminAuth roles={['admin']}>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />

          {/* Davetiye route'ları en sona alındı, /admin ve / ile çakışmasın diye */}
          <Route path="/:slug" element={<WeddingInvite />} />
          <Route path="/:slug/:token" element={<WeddingInvite />} />
          <Route
            path="/admin/profile"
            element={
              <RequireAdminAuth>
                <AdminProfile />
              </RequireAdminAuth>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
