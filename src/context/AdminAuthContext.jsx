import { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin, adminLogout, getMe } from '../api/client';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await adminLogin(email, password);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await adminLogout();
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
