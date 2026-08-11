import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  getDashboard,
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  exportGuests,
} from '../../api/client';
import { useAdminAuth } from '../../context/AdminAuthContext';
import GuestFormModal from './GuestFormModal';
import MemoryModeration from '../../components/admin/MemoryModeration';
import WeddingSettings from '../../components/admin/WeddingSettings';

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const { weddingId: weddingIdParam } = useParams();
  const [stats, setStats] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [modalGuest, setModalGuest] = useState(undefined); // undefined: kapalı, null: yeni, obje: düzenle

  const weddingId = weddingIdParam || user?.wedding?.id;

  if (!weddingId) {
    return <Navigate to="/admin/weddings" replace />;
  }

  const loadData = () => {
    return Promise.all([getDashboard(weddingId), getGuests(weddingId)]).then(
      ([dashboardData, guestsData]) => {
        setStats(dashboardData);
        setGuests(guestsData);
      },
    );
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [weddingId]);

  const copyInviteLink = (guest) => {
    const slug = stats?.wedding_slug || 'elena-marco';
    const link = `${window.location.origin}/${slug}/${guest.invite_token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSubmit = async (form) => {
    if (modalGuest) {
      await updateGuest(weddingId, modalGuest.id, form);
    } else {
      await createGuest(weddingId, form);
    }
    await loadData();
  };

  const handleDelete = async (guest) => {
    if (!confirm(`${guest.display_name} silinsin mi?`)) return;
    await deleteGuest(weddingId, guest.id);
    await loadData();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportGuests(weddingId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'misafirler.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export sırasında bir hata oluştu.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg,#f7f3eb)] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Yönetim Paneli {user?.role === 'couple' && '— Elena & Marco'}
          </h1>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Çıkış Yap
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Toplam Davetli" value={stats.total_invited} />
            <StatCard
              label="Katılıyor"
              value={stats.attending}
              color="text-green-600"
            />
            <StatCard
              label="Katılmıyor"
              value={stats.not_attending}
              color="text-red-600"
            />
            <StatCard
              label="Bekliyor"
              value={stats.pending}
              color="text-yellow-600"
            />
            <StatCard label="Toplam Kişi" value={stats.total_attendee_count} />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
          >
            {exporting ? 'İndiriliyor...' : 'CSV Dışa Aktar'}
          </button>
          <button
            onClick={() => setModalGuest(null)}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white"
          >
            + Misafir Ekle
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">İsim</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Max Kişi</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Davetiye</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-t">
                  <td className="px-4 py-3">{guest.display_name}</td>
                  <td className="px-4 py-3">{guest.phone || '—'}</td>
                  <td className="px-4 py-3">{guest.max_guests}</td>
                  <td className="px-4 py-3">
                    {guest.rsvps?.length
                      ? guest.rsvps[guest.rsvps.length - 1].attending
                        ? 'Katılıyor'
                        : 'Katılmıyor'
                      : 'Bekliyor'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyInviteLink(guest)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {copiedId === guest.id ? 'Kopyalandı ✓' : 'Linki Kopyala'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => setModalGuest(guest)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(guest)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Henüz misafir eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <MemoryModeration weddingId={weddingId} />
        <WeddingSettings weddingId={weddingId} />
      </div>

      {modalGuest !== undefined && (
        <GuestFormModal
          guest={modalGuest}
          onClose={() => setModalGuest(undefined)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
