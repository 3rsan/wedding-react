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
    <section className="min-h-screen flex flex-col md:flex-row bg-[var(--color-bg)]">
      {/* Sol: Tipografi */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 order-2 md:order-1">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.4em] uppercase text-[var(--color-primary)] mb-6"
        >
          Düğünümüze Davetlisiniz
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-sans text-5xl md:text-7xl font-bold leading-[0.95] text-[var(--color-text)] mb-8"
        >
          {brideName}
          <br />
          <span className="text-[var(--color-primary)]">&</span> {groomName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg text-[var(--color-text)]/60 tracking-wide"
        >
          {formattedDate}
        </motion.p>
      </div>

      {/* Sağ: Görsel/Video */}
      <div className="flex-1 relative min-h-[50vh] md:min-h-screen order-1 md:order-2">
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
          <img
            src={coverImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-primary)]/10" />
        )}
      </div>
    </section>
  );
}
