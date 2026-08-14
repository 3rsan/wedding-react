import { useState } from 'react';
import { submitRsvp } from '../../api/client';

export default function RsvpForm({ slug, token, guest }) {
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('idle');

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
      <p
        className="text-center font-medium py-6"
        style={{ color: 'var(--color-primary)' }}
      >
        Cevabınız kaydedildi, teşekkürler 🌸
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto space-y-4 bg-white rounded-2xl p-8 shadow-sm"
    >
      <p className="text-center text-sm text-[var(--color-text)]/70">
        Merhaba {guest?.display_name}, katılım durumunuzu belirtir misiniz?
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className="flex-1 py-2 rounded-full text-sm border-2 transition"
          style={
            attending
              ? {
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderColor: 'var(--color-primary)',
                }
              : { borderColor: 'var(--color-primary)', opacity: 0.4 }
          }
        >
          Katılıyorum
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className="flex-1 py-2 rounded-full text-sm border-2 transition"
          style={
            !attending
              ? {
                  backgroundColor: 'var(--color-text)',
                  color: 'white',
                  borderColor: 'var(--color-text)',
                }
              : { borderColor: 'var(--color-text)', opacity: 0.4 }
          }
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
            className="w-full mt-1 px-3 py-2 border rounded-full text-sm text-center"
            style={{ borderColor: 'var(--color-primary)' }}
          />
        </div>
      )}

      <textarea
        placeholder="Eklemek istediğiniz bir not var mı? (opsiyonel)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border rounded-2xl text-sm resize-none"
        style={{ borderColor: 'var(--color-primary)' }}
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3 rounded-full text-white text-sm disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-primary)' }}
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
