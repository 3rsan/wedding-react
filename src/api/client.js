import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
});

// Admin token'ı varsa her isteğe otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 gelirse (token geçersiz/süresi dolmuş) otomatik logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

// --- Public endpoints (mevcut) ---

export const getWedding = (slug) =>
  api.get(`/weddings/${slug}`).then((r) => r.data);

export const getGuestInvite = (slug, token) =>
  api.get(`/weddings/${slug}/guest/${token}`).then((r) => r.data);

export const submitRsvp = (slug, token, payload) =>
  api
    .post(`/weddings/${slug}/guest/${token}/rsvp`, payload)
    .then((r) => r.data);

export const getRsvps = (slug) =>
  api.get(`/weddings/${slug}/rsvps`).then((r) => r.data);

export const getMemories = (slug) =>
  api.get(`/weddings/${slug}/memories`).then((r) => r.data);

export const submitMemory = (slug, formData) =>
  api
    .post(`/weddings/${slug}/memories`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

// --- Admin endpoints ---

export const adminLogin = (email, password) =>
  api.post('/admin/login', { email, password }).then((r) => {
    localStorage.setItem('admin_token', r.data.token);
    return r.data;
  });

export const adminLogout = () =>
  api.post('/admin/logout').then(() => {
    localStorage.removeItem('admin_token');
  });

export const getMe = () => api.get('/admin/me').then((r) => r.data);

export const getGuests = (weddingId) =>
  api.get(`/admin/weddings/${weddingId}/guests`).then((r) => r.data);

export const createGuest = (weddingId, payload) =>
  api.post(`/admin/weddings/${weddingId}/guests`, payload).then((r) => r.data);

export const updateGuest = (weddingId, guestId, payload) =>
  api
    .put(`/admin/weddings/${weddingId}/guests/${guestId}`, payload)
    .then((r) => r.data);

export const deleteGuest = (weddingId, guestId) =>
  api
    .delete(`/admin/weddings/${weddingId}/guests/${guestId}`)
    .then((r) => r.data);

export const getDashboard = (weddingId) =>
  api.get(`/admin/weddings/${weddingId}/dashboard`).then((r) => r.data);

export const exportGuests = (weddingId) =>
  api
    .get(`/admin/weddings/${weddingId}/export`, { responseType: 'blob' })
    .then((r) => r.data);

export const getAdminMemories = (weddingId, status) =>
  api
    .get(`/admin/weddings/${weddingId}/memories`, {
      params: status ? { status } : {},
    })
    .then((r) => r.data);

export const approveMemory = (weddingId, memoryId) =>
  api
    .post(`/admin/weddings/${weddingId}/memories/${memoryId}/approve`)
    .then((r) => r.data);

export const rejectMemory = (weddingId, memoryId) =>
  api
    .post(`/admin/weddings/${weddingId}/memories/${memoryId}/reject`)
    .then((r) => r.data);

export const deleteMemory = (weddingId, memoryId) =>
  api
    .delete(`/admin/weddings/${weddingId}/memories/${memoryId}`)
    .then((r) => r.data);

export const getWeddingSettings = (weddingId) =>
  api.get(`/admin/weddings/${weddingId}/settings`).then((r) => r.data);

export const updateWeddingSettings = (weddingId, payload) =>
  api.put(`/admin/weddings/${weddingId}/settings`, payload).then((r) => r.data);

export const uploadCoverImage = (weddingId, file) => {
  const formData = new FormData();
  formData.append('cover_image', file);
  return api
    .post(`/admin/weddings/${weddingId}/settings/cover-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

export const getWeddings = () => api.get('/admin/weddings').then((r) => r.data);

export const createWedding = (payload) =>
  api.post('/admin/weddings', payload).then((r) => r.data);

export const removeCoverImage = (weddingId) =>
  api
    .delete(`/admin/weddings/${weddingId}/settings/cover-image`)
    .then((r) => r.data);

export const deleteWedding = (weddingId) =>
  api.delete(`/admin/weddings/${weddingId}`).then((r) => r.data);

export const downloadAllMemories = (weddingId) =>
  api
    .get(`/admin/weddings/${weddingId}/memories/zip`, { responseType: 'blob' })
    .then((r) => r.data);
