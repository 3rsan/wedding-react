import axios from 'axios';

// Lokalde .env yoksa vite.config.js'teki proxy'ye düşer (/api -> localhost:8000)
// Netlify'da VITE_API_URL ortam değişkeni Railway backend adresine ayarlanmalı
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
});

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
