import { useEffect, useState } from 'react';
import Envelope from './components/Envelope';
import Hero from './components/Hero';
import RsvpForm from './components/RsvpForm';
import Countdown from './components/Countdown';
import Venues from './components/Venues';
import Gallery from './components/Gallery';
import { getWedding, getGuestInvite } from './api/client';
import { useWeddingStore } from './store/useWeddingStore';

// URL yapısı: /{slug}/{token}  -> ör: /elena-marco/ax92kd81
function useRouteParams() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return { slug: parts[0], token: parts[1] };
}

export default function App() {
  const { slug, token } = useRouteParams();
  const { wedding, guest, setWedding, setGuest, envelopeOpened } =
    useWeddingStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      getWedding(slug),
      token ? getGuestInvite(slug, token) : Promise.resolve(null),
    ])
      .then(([weddingData, guestData]) => {
        setWedding(weddingData);
        if (guestData) setGuest(guestData);
      })
      .finally(() => setLoading(false));
  }, [slug, token]);

  if (!slug) {
    return <p className="p-10 text-center">Geçersiz davetiye linki.</p>;
  }

  if (loading) {
    return <p className="p-10 text-center">Yükleniyor...</p>;
  }

  if (!wedding) {
    return <p className="p-10 text-center">Davetiye bulunamadı.</p>;
  }

  return (
    <>
      <Envelope groomName={wedding.groom_name} brideName={wedding.bride_name} />

      {envelopeOpened && (
        <main>
          <Hero
            groomName={wedding.groom_name}
            brideName={wedding.bride_name}
            weddingDate={wedding.wedding_date}
            heroVideo={wedding.hero_video}
          />

          <Countdown weddingDate={wedding.wedding_date} />

          {token && guest && (
            <section className="py-16 px-4 bg-[var(--color-bg)]">
              <RsvpForm slug={slug} token={token} guest={guest} />
            </section>
          )}

          <Venues venues={wedding.venues} />

          <Gallery slug={slug} />
        </main>
      )}
    </>
  );
}
