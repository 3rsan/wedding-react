import { useState } from 'react';
import { toast } from 'sonner';
import { updateWeddingSettings } from '../../api/client';

const emptyVenue = {
  type: '',
  label: '',
  name: '',
  address: '',
  time: '',
  lat: '',
  lng: '',
};

export default function VenuesEditor({ weddingId, venues, onUpdated }) {
  const [localVenues, setLocalVenues] = useState(venues || []);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (index, field, value) => {
    setLocalVenues((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const handleAdd = () => {
    setLocalVenues((prev) => [...prev, { ...emptyVenue }]);
  };

  const handleRemove = (index) => {
    setLocalVenues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateWeddingSettings(weddingId, {
        venues: localVenues,
      });
      setLocalVenues(result.venues);
      onUpdated(result.venues);
      toast.success('Mekanlar kaydedildi.');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Kaydetme sırasında hata oluştu.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      <h2 className="text-lg font-semibold">Düğün Yerleri</h2>

      <div className="space-y-4">
        {localVenues.map((venue, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 relative">
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-3 right-3 text-xs text-red-500 hover:underline"
            >
              Kaldır
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Tür (ör: nikah, dugun)">
                <input
                  type="text"
                  value={venue.type}
                  onChange={(e) =>
                    handleFieldChange(index, 'type', e.target.value)
                  }
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Etiket (ör: Nikah Töreni)">
                <input
                  type="text"
                  value={venue.label}
                  onChange={(e) =>
                    handleFieldChange(index, 'label', e.target.value)
                  }
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Mekan Adı">
                <input
                  type="text"
                  value={venue.name}
                  onChange={(e) =>
                    handleFieldChange(index, 'name', e.target.value)
                  }
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Saat (ör: 15:30)">
                <input
                  type="text"
                  value={venue.time}
                  onChange={(e) =>
                    handleFieldChange(index, 'time', e.target.value)
                  }
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                />
              </Field>
            </div>

            <Field label="Adres">
              <textarea
                value={venue.address}
                onChange={(e) =>
                  handleFieldChange(index, 'address', e.target.value)
                }
                rows={2}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm resize-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Enlem (lat)">
                <input
                  type="text"
                  value={venue.lat}
                  onChange={(e) =>
                    handleFieldChange(index, 'lat', e.target.value)
                  }
                  placeholder="ör: 40.7484"
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Boylam (lng)">
                <input
                  type="text"
                  value={venue.lng}
                  onChange={(e) =>
                    handleFieldChange(index, 'lng', e.target.value)
                  }
                  placeholder="ör: -73.9857"
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                />
              </Field>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Adresi haritada bul (koordinatları buradan alabilirsin)
            </a>
          </div>
        ))}

        {localVenues.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            Henüz bir mekan eklenmemiş.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
        >
          + Mekan Ekle
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Mekanları Kaydet'}
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
