import { useState } from 'react';
import { toast } from 'sonner';
import { updatePassword } from '../../api/client';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminProfile() {
  const { user } = useAdminAuth();
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await updatePassword(form);
      toast.success('Şifreniz güncellendi.');
      setForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.errors?.current_password?.[0] ||
          err.response?.data?.message ||
          'Bir hata oluştu.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg,#f7f3eb)] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Profil</h1>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">E-posta</p>
          <p className="text-sm font-medium mb-4">{user?.email}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-500">Mevcut Şifre</span>
              <input
                type="password"
                value={form.current_password}
                onChange={(e) =>
                  setForm({ ...form, current_password: e.target.value })
                }
                required
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-500">Yeni Şifre</span>
              <input
                type="password"
                value={form.new_password}
                onChange={(e) =>
                  setForm({ ...form, new_password: e.target.value })
                }
                required
                minLength={6}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-500">Yeni Şifre (Tekrar)</span>
              <input
                type="password"
                value={form.new_password_confirmation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    new_password_confirmation: e.target.value,
                  })
                }
                required
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white disabled:opacity-50"
            >
              {submitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
