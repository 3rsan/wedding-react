import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from '../../context/AdminAuthContext';
import RequireAdminAuth from '../../components/RequireAdminAuth';
import AdminLogin from '../../pages/AdminLogin';
import WeddingInvite from '../../pages/WeddingInvite';
// AdminDashboard, GuestList vs. henüz yazmadık

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Public davetiye sayfaları */}
          <Route path="/:slug" element={<WeddingInvite />} />
          <Route path="/:slug/:token" element={<WeddingInvite />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                {/* <AdminDashboard /> - sıradaki adımda yazacağız */}
              </RequireAdminAuth>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
