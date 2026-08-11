import { motion } from 'framer-motion';

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
      {heroVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : coverImageUrl ? (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        />
      ) : null}

      {(heroVideo || coverImageUrl) && (
        <div className="absolute inset-0 bg-black/30" />
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`text-sm tracking-[0.3em] uppercase mb-3 ${
            heroVideo || coverImageUrl
              ? 'text-white/80'
              : 'text-[var(--color-text)]/60'
          }`}
        >
          Düğünümüze Davetlisiniz
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className={`font-serif text-4xl md:text-6xl font-light mb-4 ${
            heroVideo || coverImageUrl
              ? 'text-white'
              : 'text-[var(--color-text)]'
          }`}
        >
          {brideName} <span className="text-[var(--color-primary)]">&</span>{' '}
          {groomName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className={`text-lg md:text-2xl ${
            heroVideo || coverImageUrl
              ? 'text-white/80'
              : 'text-[var(--color-text)]/70'
          }`}
        >
          {formattedDate}
        </motion.p>
      </div>
    </section>
  );
}
