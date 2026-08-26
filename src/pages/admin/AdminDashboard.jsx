import { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  getDashboard,
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  exportGuests,
  importGuests,
  toggleInviteSent,
  getWeddingSettings,
} from '../../api/client';
import { useAdminAuth } from '../../context/AdminAuthContext';
import GuestFormModal from './GuestFormModal';
import MemoryModeration from '../../components/admin/MemoryModeration';
import WeddingSettings from '../../components/admin/WeddingSettings';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import VenuesEditor from '../../components/admin/VenuesEditor';

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const { weddingId: weddingIdParam } = useParams();
  const [stats, setStats] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [modalGuest, setModalGuest] = useState(undefined);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [guestToUnmark, setGuestToUnmark] = useState(null);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [settings, setSettings] = useState(null);

  const weddingId = weddingIdParam || user?.wedding?.id;

  if (!weddingId) {
    return <Navigate to="/admin/weddings" replace />;
  }

  const loadData = () => {
    return Promise.all([
      getDashboard(weddingId),
      getGuests(weddingId),
      getWeddingSettings(weddingId),
    ]).then(([dashboardData, guestsData, settingsData]) => {
      setStats(dashboardData);
      setGuests(guestsData);
      setSettings(settingsData);
    });
  };

  const buildWhatsAppLink = (guest) => {
    const slug = stats?.wedding_slug || 'elena-marco';
    const inviteLink = `${window.location.origin}/${slug}/${guest.invite_token}`;
    const message = `Merhaba ${guest.display_name}, düğünümüze davetlisiniz! Detaylar ve katılım bildirimi için: ${inviteLink}`;

    let phone = (guest.phone || '').replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '9' + phone;
    else if (!phone.startsWith('90')) phone = '90' + phone;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleToggleSent = async (guest) => {
    await toggleInviteSent(weddingId, guest.id);
    await loadData();
  };

  const handleConfirmUnmark = async () => {
    if (!guestToUnmark) return;
    await handleToggleSent(guestToUnmark);
    setGuestToUnmark(null);
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

  const handleConfirmDelete = async () => {
    if (!guestToDelete) return;
    await deleteGuest(weddingId, guestToDelete.id);
    setGuestToDelete(null);
    await loadData();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await importGuests(weddingId, file);
      toast.success(
        `${result.created} misafir eklendi.${result.skipped ? ` ${result.skipped} satır atlandı.` : ''}`,
      );
      if (result.errors?.length) {
        result.errors.forEach((err) => toast.warning(err));
      }
      await loadData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'İçe aktarma sırasında hata oluştu.',
      );
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
      toast.error('Export sırasında bir hata oluştu.');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'display_name;phone;max_guests\nAhmet Yılmaz;05551234567;2\nFatma Kaya;;1\n';
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'misafir-sablonu.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="p-10 text-center">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg,#f7f3eb)] p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl md:text-2xl font-semibold">
            Yönetim Paneli
            {stats && ` — ${stats.bride_name} & ${stats.groom_name}`}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/profile"
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Profil
            </Link>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
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

        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
          >
            Şablon İndir
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
          >
            {exporting ? 'İndiriliyor...' : 'CSV Dışa Aktar'}
          </button>

          <label className="px-4 py-2 text-sm rounded-md border cursor-pointer hover:bg-gray-50">
            {importing ? 'Yükleniyor...' : 'CSV İçe Aktar'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleImportFile}
              disabled={importing}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setModalGuest(null)}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white"
          >
            + Misafir Ekle
          </button>
        </div>

        <p className="text-xs text-gray-400 text-right">
          CSV sütunları: <code>display_name; phone; max_guests</code> (Türkçe:{' '}
          <code>isim; telefon; max kişi</code> de kabul edilir)
        </p>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">İsim</th>
                  <th className="px-4 py-3">Telefon</th>
                  <th className="px-4 py-3">Max Kişi</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">Davetiye</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} className="border-t">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {guest.display_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {guest.phone || '—'}
                    </td>
                    <td className="px-4 py-3">{guest.max_guests}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {guest.rsvps?.length
                        ? guest.rsvps[guest.rsvps.length - 1].attending
                          ? 'Katılıyor'
                          : 'Katılmıyor'
                        : 'Bekliyor'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => copyInviteLink(guest)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {copiedId === guest.id
                          ? 'Kopyalandı ✓'
                          : 'Linki Kopyala'}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {guest.phone ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={buildWhatsAppLink(guest)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => {
                              if (!guest.invite_sent_at)
                                handleToggleSent(guest);
                            }}
                            className="text-sm text-green-600 hover:underline"
                          >
                            Gönder
                          </a>
                          {guest.invite_sent_at && (
                            <button
                              onClick={() => setGuestToUnmark(guest)}
                              className="text-xs text-gray-400 hover:text-red-500"
                              title={`Gönderildi: ${new Date(guest.invite_sent_at).toLocaleString('tr-TR')}`}
                            >
                              ✓ Gönderildi
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Tel. yok</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => setModalGuest(guest)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => setGuestToDelete(guest)}
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
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Henüz misafir eklenmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {settings && (
          <WeddingSettings
            weddingId={weddingId}
            settings={settings}
            onUpdated={(updated) => setSettings(updated)}
            onRefresh={loadData}
          />
        )}

        {settings && (
          <VenuesEditor
            weddingId={weddingId}
            venues={settings.venues}
            onUpdated={(venues) => setSettings((prev) => ({ ...prev, venues }))}
          />
        )}

        <MemoryModeration weddingId={weddingId} />
      </div>

      {modalGuest !== undefined && (
        <GuestFormModal
          guest={modalGuest}
          onClose={() => setModalGuest(undefined)}
          onSubmit={handleSubmit}
        />
      )}

      {guestToUnmark && (
        <ConfirmDialog
          title="Gönderim İşaretini Kaldır"
          description={`${guestToUnmark.display_name} için "gönderildi" işaretini kaldırmak istediğine emin misin?`}
          confirmLabel="İşareti Kaldır"
          danger
          onConfirm={handleConfirmUnmark}
          onCancel={() => setGuestToUnmark(null)}
        />
      )}

      {guestToDelete && (
        <ConfirmDialog
          title="Misafiri Sil"
          description={`${guestToDelete.display_name} silinsin mi?`}
          confirmLabel="Sil"
          danger
          onConfirm={handleConfirmDelete}
          onCancel={() => setGuestToDelete(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl md:text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
