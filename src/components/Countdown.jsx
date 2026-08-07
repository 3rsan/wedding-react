import { useEffect, useState } from 'react'

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown({ weddingDate }) {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate))

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  const units = [
    { label: 'Gün', value: time.days },
    { label: 'Saat', value: time.hours },
    { label: 'Dakika', value: time.minutes },
    { label: 'Saniye', value: time.seconds },
  ]

  return (
    <section className="py-20 px-4 text-center bg-[var(--color-bg)]">
      <p className="text-sm tracking-[0.3em] uppercase mb-6 text-[var(--color-text)]/60">
        Büyük Güne Kalan Süre
      </p>

      <div className="flex justify-center gap-4 md:gap-8">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl flex items-center justify-center shadow-lg border bg-white border-[var(--color-text)]/10">
              <span className="text-3xl md:text-5xl font-light text-[var(--color-text)]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-3 text-sm tracking-widest uppercase text-[var(--color-text)]/60">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
