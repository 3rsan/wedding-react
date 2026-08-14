import { motion } from 'framer-motion';

function LeafCorner({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ color: 'var(--color-primary)' }}
    >
      <path
        d="M10 90 Q10 40 50 20 Q30 50 40 80 Q20 70 10 90"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M15 85 Q20 50 55 25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export default function Hero({
  groomName,
  brideName,
  weddingDate,
  heroVideo,
  coverImageUrl,
}) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      <LeafCorner className="absolute top-0 left-0 w-40 h-40 md:w-56 md:h-56" />
      <LeafCorner className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 rotate-180" />

      {heroVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-15"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />
      ) : null}

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-sm tracking-[0.3em] uppercase mb-4 text-[var(--color-primary)]"
        >
          🌿 Düğünümüze Davetlisiniz 🌿
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="font-serif text-4xl md:text-6xl font-light text-[var(--color-text)] mb-4"
        >
          {brideName} <span className="text-[var(--color-primary)]">&</span>{' '}
          {groomName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-[var(--color-text)]/60"
        >
          {formattedDate}
        </motion.p>
      </div>
    </section>
  );
}
