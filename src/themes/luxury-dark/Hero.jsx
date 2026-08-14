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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {heroVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
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
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 1.2 }}
          className="text-xs uppercase mb-6"
          style={{ color: 'var(--color-primary)' }}
        >
          Düğünümüze Davetlisiniz
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-serif text-5xl md:text-7xl font-light text-white mb-6"
        >
          {brideName} <span style={{ color: 'var(--color-primary)' }}>&</span>{' '}
          {groomName}
        </motion.h1>

        <div
          className="w-24 h-px mb-6"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg text-white/70 tracking-wide"
        >
          {formattedDate}
        </motion.p>
      </div>
    </section>
  );
}
