import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWedding, getGuestInvite } from '../api/client';
import { useWeddingStore } from '../store/useWeddingStore';
import { getTheme } from '../themes/registry';

export default function WeddingInvite() {
  const { slug, token } = useParams();
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

  useEffect(() => {
    if (!wedding?.theme_colors) return;
    const root = document.documentElement;
    const { primary, text, bg } = wedding.theme_colors;
    if (primary) root.style.setProperty('--color-primary', primary);
    if (text) root.style.setProperty('--color-text', text);
    if (bg) root.style.setProperty('--color-bg', bg);
    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-text');
      root.style.removeProperty('--color-bg');
    };
  }, [wedding]);

  if (!slug) {
    return <p className="p-10 text-center">Geçersiz davetiye linki.</p>;
  }

  if (loading) {
    return <p className="p-10 text-center">Yükleniyor...</p>;
  }

  if (!wedding) {
    return <p className="p-10 text-center">Davetiye bulunamadı.</p>;
  }

  const theme = getTheme(wedding.theme);
  const { Envelope, Hero, Venues, Gallery, RsvpForm, Countdown } =
    theme.components;

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
            coverImageUrl={wedding.cover_image_url}
            venue={wedding.venues?.[0]}
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
