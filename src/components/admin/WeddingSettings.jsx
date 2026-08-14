import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getWeddingSettings,
  updateWeddingSettings,
  uploadCoverImage,
  removeCoverImage,
  resetWeddingColors,
} from '../../api/client';
import { THEME_LIST } from '../../themes/registry';

export default function WeddingSettings({ weddingId }) {
  const [settings, setSettings] = useState(null);
  const [colors, setColors] = useState({ primary: '', text: '', bg: '' });
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    groom_name: '',
    bride_name: '',
    wedding_date: '',
  });
  const [savingBasic, setSavingBasic] = useState(false);

  useEffect(() => {
    getWeddingSettings(weddingId).then((data) => {
      setSettings(data);
      setColors(data.theme_colors || { primary: '', text: '', bg: '' });
      setSelectedTheme(data.theme || 'classic');
      setBasicInfo({
        groom_name: data.groom_name || '',
        bride_name: data.bride_name || '',
        wedding_date: data.wedding_date ? data.wedding_date.slice(0, 10) : '',
      });
    });
  }, [weddingId]);

  const handleSaveBasicInfo = async () => {
    setSavingBasic(true);
    try {
      await updateWeddingSettings(weddingId, basicInfo);
      toast.success('Bilgiler kaydedildi.');
    } catch {
      toast.error('Kaydetme sırasında hata oluştu.');
    } finally {
      setSavingBasic(false);
    }
  };

  const handleThemeSelect = async (themeId) => {
    setSelectedTheme(themeId);
    try {
      await updateWeddingSettings(weddingId, { theme: themeId });
      toast.success('Tema güncellendi.');
    } catch {
      toast.error('Tema kaydedilirken hata oluştu.');
    }
  };

  const handleColorChange = (key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveColors = async () => {
    setSaving(true);
    try {
      await updateWeddingSettings(weddingId, { theme_colors: colors });
      toast.success('Renkler kaydedildi.');
    } catch {
      toast.error('Kaydetme sırasında hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadCoverImage(weddingId, file);
      const fresh = await getWeddingSettings(weddingId);
      setSettings(fresh);
      toast.success('Kapak görseli güncellendi.');
    } catch {
      toast.error('Görsel yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!confirm('Kapak görselini kaldırmak istediğine emin misin?')) return;
    setRemoving(true);
    try {
      await removeCoverImage(weddingId);
      setSettings((prev) => ({
        ...prev,
        cover_image: null,
        cover_image_url: null,
      }));
      toast.success('Kapak görseli kaldırıldı.');
    } catch {
      toast.error('Kaldırma sırasında hata oluştu.');
    } finally {
      setRemoving(false);
    }
  };

  const handleResetColors = async () => {
    setResetting(true);
    try {
      const result = await resetWeddingColors(weddingId);
      setColors(result.theme_colors);
      toast.success('Renkler orijinaline döndürüldü.');
    } catch {
      toast.error('Sıfırlama sırasında hata oluştu.');
    } finally {
      setResetting(false);
    }
  };

  if (!settings) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">Yükleniyor...</p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-6">
      <h2 className="text-lg font-semibold">Tasarım Ayarları</h2>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Temel Bilgiler</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          <label className="block">
            <span className="text-xs text-gray-500">Gelin Adı</span>
            <input
              type="text"
              value={basicInfo.bride_name}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, bride_name: e.target.value })
              }
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs text-gray-500">Damat Adı</span>
            <input
              type="text"
              value={basicInfo.groom_name}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, groom_name: e.target.value })
              }
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs text-gray-500">Düğün Tarihi</span>
            <input
              type="date"
              value={basicInfo.wedding_date}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, wedding_date: e.target.value })
              }
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </label>
        </div>

        <button
          onClick={handleSaveBasicInfo}
          disabled={savingBasic}
          className="mt-4 px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white disabled:opacity-50"
        >
          {savingBasic ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Tema</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEME_LIST.map((theme) => {
            const { Hero: ThemeHero } = theme.components;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`border rounded-lg overflow-hidden text-left text-sm transition ${
                  selectedTheme === theme.id
                    ? 'border-[var(--color-primary,#d4a04a)] ring-2 ring-[var(--color-primary,#d4a04a)]/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gray-50 overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 origin-top-left pointer-events-none"
                    style={{
                      width: '1200px',
                      height: '800px',
                      transform: 'scale(0.183)',
                    }}
                  >
                    <ThemeHero
                      groomName="Ozan"
                      brideName="Ceren"
                      weddingDate="2026-10-17"
                      heroVideo={null}
                      coverImageUrl={null}
                    />
                  </div>
                </div>
                <p className="p-2 font-medium">{theme.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Kapak Görseli</p>
        {settings.cover_image_url && (
          <img
            src={settings.cover_image_url}
            alt="Kapak"
            className="w-full max-w-md h-48 object-cover rounded-lg mb-3"
          />
        )}
        <div className="flex gap-2">
          <label className="inline-block px-4 py-2 text-sm rounded-md border cursor-pointer hover:bg-gray-50">
            {uploading ? 'Yükleniyor...' : 'Görsel Değiştir'}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {settings.cover_image_url && (
            <button
              onClick={handleRemoveCover}
              disabled={removing}
              className="px-4 py-2 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {removing ? 'Kaldırılıyor...' : 'Görseli Kaldır'}
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Renk Paleti</p>
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <ColorField
            label="Ana Renk"
            value={colors.primary}
            onChange={(v) => handleColorChange('primary', v)}
          />
          <ColorField
            label="Yazı Rengi"
            value={colors.text}
            onChange={(v) => handleColorChange('text', v)}
          />
          <ColorField
            label="Arka Plan"
            value={colors.bg}
            onChange={(v) => handleColorChange('bg', v)}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSaveColors}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-primary,#d4a04a)] text-white disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Renkleri Kaydet'}
          </button>

          {settings.default_theme_colors && (
            <button
              onClick={handleResetColors}
              disabled={resetting}
              className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
            >
              {resetting ? 'Sıfırlanıyor...' : 'Orijinale Sıfırla'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-md px-2 py-1 text-sm"
        />
      </div>
    </label>
  );
}
