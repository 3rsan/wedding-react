import { useEffect, useState } from 'react';

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ weddingDate }) {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const units = [
    { label: 'Gün', value: time.days },
    { label: 'Saat', value: time.hours },
    { label: 'Dakika', value: time.minutes },
    { label: 'Saniye', value: time.seconds },
  ];

  return (
    <section className="py-24 px-4 text-center bg-[var(--color-bg)]">
      <div
        className="w-10 h-px mx-auto mb-6"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
      <p className="font-serif italic text-lg mb-10 text-[var(--color-text)]/70">
        Büyük Güne Kalan Süre
      </p>

      <div className="flex justify-center gap-3 md:gap-6">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div
              className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-2"
              style={{ borderColor: 'var(--color-primary)' }}
            >
              <span className="text-2xl md:text-4xl font-serif font-light text-[var(--color-text)]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-3 text-xs tracking-[0.2em] uppercase text-[var(--color-text)]/50">
              {unit.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="w-10 h-px mx-auto mt-10"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
    </section>
  );
}
