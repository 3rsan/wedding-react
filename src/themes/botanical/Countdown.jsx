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
    <section className="py-20 px-4 text-center bg-[var(--color-bg)]">
      <p className="text-sm mb-10 text-[var(--color-primary)]">
        🌿 Büyük Güne Kalan Süre 🌿
      </p>

      <div className="flex justify-center gap-4 md:gap-8">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <span className="text-2xl md:text-4xl font-light text-[var(--color-text)]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-3 text-xs tracking-widest uppercase text-[var(--color-text)]/50">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
