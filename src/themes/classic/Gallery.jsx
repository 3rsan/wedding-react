import { useEffect, useState } from 'react';
import { getMemories, submitMemory } from '../../api/client';

function MemoryCard({ memory }) {
  return (
    <div className="p-5 rounded-xl shadow-sm border bg-white border-[var(--color-text)]/10">
      {memory.media_type === 'photo' && memory.media_url && (
        <img
          src={memory.media_url}
          alt=""
          className="w-full h-44 object-cover rounded-lg mb-4"
        />
      )}
      {memory.media_type === 'video' && memory.media_url && (
        <video
          src={memory.media_url}
          controls
          className="w-full h-44 object-cover rounded-lg mb-4"
        />
      )}
      {memory.media_type === 'audio' && memory.media_url && (
        <audio src={memory.media_url} controls className="w-full mb-4" />
      )}

      <p className="font-medium text-base mb-1 text-[var(--color-text)]">
        {memory.first_name} {memory.last_name}
      </p>
      {memory.message && (
        <p className="text-sm leading-relaxed text-[var(--color-text)]/60 mb-3">
          {memory.message}
        </p>
      )}

      {memory.media_url && (
        <a
          href={memory.media_url}
          download
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs font-medium text-[var(--color-primary)] hover:underline"
        >
          İndir
        </a>
      )}
    </div>
  );
}

function MemoryForm({ slug, onSubmitted }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData();
    formData.append('first_name', firstName);
    if (lastName) formData.append('last_name', lastName);
    if (message) formData.append('message', message);
    if (file) formData.append('media', file);

    try {
      await submitMemory(slug, formData);
      setStatus('done');
      setFirstName('');
      setLastName('');
      setMessage('');
      setFile(null);
      onSubmitted?.();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="text-center text-[var(--color-primary)] font-medium py-4">
        Notunuz için teşekkürler! 🥰
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="İsim"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg text-sm border-[var(--color-text)]/10"
        />
        <input
          placeholder="Soyisim"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg text-sm border-[var(--color-text)]/10"
        />
      </div>

      <textarea
        placeholder="Hatıra notunuzu yazın..."
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg text-sm resize-none border-[var(--color-text)]/10"
      />

      <label className="flex flex-col items-center justify-center gap-1 px-3 py-4 border border-dashed rounded-lg cursor-pointer border-[var(--color-primary)]">
        <span className="text-xs text-[var(--color-text)]/60">
          {file ? file.name : 'Fotoğraf veya video ekle (opsiyonel)'}
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3 rounded-lg text-center text-white text-sm disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {status === 'sending' ? 'Gönderiliyor...' : 'Notu Gönder'}
      </button>

      {status === 'error' && (
        <p className="text-center text-red-500 text-xs">
          Bir hata oluştu, tekrar deneyin.
        </p>
      )}
    </form>
  );
}

export default function Gallery({ slug }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    getMemories(slug)
      .then(setMemories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <section className="py-24 px-4 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 text-[var(--color-text)]/60">
            Anılarımız
          </p>
          <h2 className="text-4xl md:text-5xl font-light font-serif text-[var(--color-text)]">
            Fotoğraf Galerisi
          </h2>
        </div>

        {!loading && memories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}

        <div className="max-w-md mx-auto">
          <h3 className="text-2xl md:text-3xl font-light mb-8 text-center font-serif text-[var(--color-text)]">
            Hatıra Notu Bırakın
          </h3>
          <MemoryForm slug={slug} onSubmitted={refresh} />
        </div>
      </div>
    </section>
  );
}
