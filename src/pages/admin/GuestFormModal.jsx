import { useEffect, useState } from 'react';

const emptyForm = { display_name: '', phone: '', max_guests: 1 };

export default function GuestFormModal({ guest, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (guest) {
      setForm({
        display_name: guest.display_name || '',
        phone: guest.phone || '',
        max_guests: guest.max_guests || 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [guest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-lg font-semibold">
          {guest ? 'Misafiri Düzenle' : 'Yeni Misafir Ekle'}
        </h2>

        <label className="block">
          <span className="text-sm text-gray-600">İsim</span>
          <input
            type="text"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Telefon (opsiyonel)</span>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Max Kişi Sayısı</span>
          <input
            type="number"
            min={1}
            max={20}
            value={form.max_guests}
            onChange={(e) =>
              setForm({ ...form, max_guests: Number(e.target.value) })
            }
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

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
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
