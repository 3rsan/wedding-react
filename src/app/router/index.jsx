import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from '../../context/AdminAuthContext';
import RequireAdminAuth from '../../components/RequireAdminAuth';
import AdminLogin from '../../pages/AdminLogin';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import WeddingInvite from '../../pages/WeddingInvite';
import { Toaster } from 'sonner';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/:slug" element={<WeddingInvite />} />
          <Route path="/:slug/:token" element={<WeddingInvite />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
