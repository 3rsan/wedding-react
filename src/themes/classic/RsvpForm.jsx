import { useState } from 'react';
import { submitRsvp } from '../../api/client';

export default function RsvpForm({ slug, token, guest }) {
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitRsvp(slug, token, {
        attending,
        guest_count: guestCount,
        note,
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="text-center text-[var(--color-primary)] font-medium py-6">
        Cevabınız kaydedildi, teşekkürler! 🎉
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <p className="text-center text-sm text-[var(--color-text)]/70">
        Merhaba {guest?.display_name}, katılım durumunuzu belirtir misiniz?
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className={`flex-1 py-2 rounded-full text-sm border ${attending ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-[var(--color-text)]/20'}`}
        >
          Katılıyorum
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className={`flex-1 py-2 rounded-full text-sm border ${!attending ? 'bg-[var(--color-text)] text-white border-[var(--color-text)]' : 'border-[var(--color-text)]/20'}`}
        >
          Katılamıyorum
        </button>
      </div>

      {attending && (
        <div>
          <label className="text-xs text-[var(--color-text)]/60">
            Kaç kişi geleceksiniz?
          </label>
          <input
            type="number"
            min={1}
            max={guest?.max_guests ?? 1}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      )}

      <textarea
        placeholder="Eklemek istediğiniz bir not var mı? (opsiyonel)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3 rounded-lg bg-[var(--color-primary)] text-white text-sm disabled:opacity-50"
      >
        {status === 'sending' ? 'Gönderiliyor...' : 'Cevabı Gönder'}
      </button>

      {status === 'error' && (
        <p className="text-center text-red-500 text-xs">
          Bir hata oluştu, tekrar deneyin.
        </p>
      )}
    </form>
  );
}
