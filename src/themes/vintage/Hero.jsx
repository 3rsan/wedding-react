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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg)] p-6">
      {heroVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-30"
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
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      ) : null}

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-xl w-full border-2 p-10 md:p-16 text-center"
        style={{ borderColor: 'var(--color-primary)' }}
      >
        <div
          className="absolute inset-2 border pointer-events-none"
          style={{ borderColor: 'var(--color-primary)', opacity: 0.5 }}
        />

        <p className="text-xs tracking-[0.5em] uppercase mb-6 text-[var(--color-primary)]">
          ~ Düğünümüze Davetlisiniz ~
        </p>

        <h1 className="font-serif italic text-3xl md:text-5xl text-[var(--color-text)] mb-6 leading-tight">
          {brideName}
          <span className="block text-2xl md:text-3xl my-2 text-[var(--color-primary)]">
            &
          </span>
          {groomName}
        </h1>

        <div
          className="w-16 h-px mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />

        <p className="text-base md:text-lg tracking-wide text-[var(--color-text)]/70">
          {formattedDate}
        </p>
      </motion.div>
    </section>
  );
}
