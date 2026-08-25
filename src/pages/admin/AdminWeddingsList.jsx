import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getWeddings, createWedding, deleteWedding } from '../../api/client';
import { useAdminAuth } from '../../context/AdminAuthContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminWeddingsList() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [weddingToDelete, setWeddingToDelete] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const load = () => {
    setLoading(true);
    return getWeddings()
      .then(setWeddings)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (form) => {
    try {
      const result = await createWedding(form);
      toast.success('Düğün oluşturuldu.');
      setCreatedCredentials(result.couple);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Oluşturma sırasında hata oluştu.',
      );
    }
  };

  const handleDeleteWedding = async () => {
    if (!weddingToDelete) return;
    try {
      await deleteWedding(weddingToDelete.id);
      toast.success('Düğün silindi.');
      setWeddingToDelete(null);
      load();
    } catch {
      toast.error('Silme sırasında hata oluştu.');
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg,#f7f3eb)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Düğünler</h1>
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

        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white"
          >
            + Yeni Düğün
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Gelin & Damat</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Misafir Sayısı</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {weddings.map((w) => (
                  <tr key={w.id} className="border-t">
                    <td className="px-4 py-3">{w.slug}</td>
                    <td className="px-4 py-3">
                      {w.bride_name} & {w.groom_name}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(w.wedding_date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">{w.guests_count ?? '—'}</td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/weddings/${w.id}`)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Yönet
                      </button>
                      <button
                        onClick={() => setWeddingToDelete(w)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {weddings.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Henüz düğün oluşturulmamış.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <CreateWeddingModal
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}

      {createdCredentials && (
        <CredentialsModal
          credentials={createdCredentials}
          onClose={() => setCreatedCredentials(null)}
        />
      )}

      {weddingToDelete && (
        <ConfirmDialog
          title="Düğünü Sil"
          description={`"${weddingToDelete.slug}" düğününü ve tüm misafir/RSVP/anı verilerini kalıcı olarak silmek üzeresin. Bu işlem geri alınamaz.`}
          confirmLabel="Kalıcı Olarak Sil"
          danger
          onConfirm={handleDeleteWedding}
          onCancel={() => setWeddingToDelete(null)}
        />
      )}
    </div>
  );
}

function CreateWeddingModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    slug: '',
    groom_name: '',
    bride_name: '',
    wedding_date: '',
    couple_email: '',
    couple_password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold">Yeni Düğün Oluştur</h2>

        <Field label="Slug (URL'de görünecek)">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="ör: ayse-kemal"
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Gelin Adı">
            <input
              type="text"
              value={form.bride_name}
              onChange={(e) => setForm({ ...form, bride_name: e.target.value })}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Damat Adı">
            <input
              type="text"
              value={form.groom_name}
              onChange={(e) => setForm({ ...form, groom_name: e.target.value })}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </Field>
        </div>

        <Field label="Düğün Tarihi">
          <input
            type="date"
            value={form.wedding_date}
            onChange={(e) => setForm({ ...form, wedding_date: e.target.value })}
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Couple E-posta (giriş için)">
          <input
            type="email"
            value={form.couple_email}
            onChange={(e) => setForm({ ...form, couple_email: e.target.value })}
            required
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Şifre (boş bırakılırsa otomatik oluşturulur)">
          <input
            type="text"
            value={form.couple_password}
            onChange={(e) =>
              setForm({ ...form, couple_password: e.target.value })
            }
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white disabled:opacity-50"
          >
            {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CredentialsModal({ credentials, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Giriş Bilgileri Oluşturuldu</h2>
        <p className="text-sm text-gray-600">
          Bu bilgileri müşteriye ilet — bir daha gösterilmeyecek.
        </p>
        <div className="bg-gray-50 rounded-md p-3 text-sm space-y-1">
          <p>
            <span className="text-gray-500">E-posta:</span> {credentials.email}
          </p>
          <p>
            <span className="text-gray-500">Şifre:</span> {credentials.password}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500">{label}</span>
      {children}
    </label>
  );
}
