import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getAdminMemories,
  approveMemory,
  rejectMemory,
  deleteMemory,
  downloadAllMemories,
} from '../../api/client';

export default function MemoryModeration({ weddingId }) {
  const [memories, setMemories] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const load = () => {
    setLoading(true);
    const status = filter === 'all' ? undefined : filter;
    return getAdminMemories(weddingId, status)
      .then(setMemories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [weddingId, filter]);

  const handleApprove = async (memory) => {
    await approveMemory(weddingId, memory.id);
    load();
  };

  const handleReject = async (memory) => {
    await rejectMemory(weddingId, memory.id);
    load();
  };

  const handleDelete = async (memory) => {
    if (!confirm('Bu anıyı kalıcı olarak silmek istiyor musun?')) return;
    await deleteMemory(weddingId, memory.id);
    load();
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      const blob = await downloadAllMemories(weddingId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'anilar.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('İndirme sırasında hata oluştu, medya olmayabilir.');
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Anılar</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-2 text-sm">
            {['pending', 'approved', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full ${
                  filter === f
                    ? 'bg-[var(--color-primary,#d4a04a)] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f === 'pending'
                  ? 'Bekleyen'
                  : f === 'approved'
                    ? 'Onaylı'
                    : 'Hepsi'}
              </button>
            ))}
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={downloadingAll}
            className="text-sm px-3 py-1 rounded-md border disabled:opacity-50"
          >
            {downloadingAll ? 'Hazırlanıyor...' : 'Tümünü İndir (ZIP)'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-6">Yükleniyor...</p>
      ) : memories.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Bu filtrede anı yok.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {memories.map((memory) => (
            <div key={memory.id} className="border rounded-lg overflow-hidden">
              {memory.media_type === 'photo' && memory.media_url && (
                <img
                  src={memory.media_url}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              )}
              {memory.media_type === 'video' && memory.media_url && (
                <video
                  src={memory.media_url}
                  controls
                  className="w-full h-40 object-cover"
                />
              )}
              {memory.media_type === 'audio' && memory.media_url && (
                <audio
                  src={memory.media_url}
                  controls
                  className="w-full mt-2"
                />
              )}

              <div className="p-3 space-y-1">
                <p className="text-sm font-medium">
                  {memory.first_name} {memory.last_name}
                </p>
                {memory.message && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {memory.message}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {memory.is_approved ? 'Onaylı' : 'Bekliyor'}
                </p>

                <div className="flex gap-2 pt-2 flex-wrap">
                  {!memory.is_approved && (
                    <button
                      onClick={() => handleApprove(memory)}
                      className="text-xs px-2 py-1 rounded bg-green-100 text-green-700"
                    >
                      Onayla
                    </button>
                  )}
                  {memory.is_approved && (
                    <button
                      onClick={() => handleReject(memory)}
                      className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700"
                    >
                      Onayı Kaldır
                    </button>
                  )}
                  {memory.media_url && (
                    <a
                      href={`${memory.media_url}${memory.media_url.includes('?') ? '&' : '?'}download=1`}
                      className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700"
                    >
                      İndir
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(memory)}
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
