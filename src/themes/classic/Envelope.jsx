import { motion, AnimatePresence } from 'framer-motion';
import { useWeddingStore } from '../../store/useWeddingStore';

export default function Envelope({ groomName, brideName }) {
  const { envelopeOpened, openEnvelope } = useWeddingStore();

  return (
    <AnimatePresence>
      {!envelopeOpened && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg)] cursor-pointer"
          exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.4 } }}
          onClick={openEnvelope}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-64 h-44 md:w-80 md:h-56"
          >
            {/* zarf gövdesi */}
            <div className="absolute inset-0 rounded-md shadow-xl bg-white border border-[var(--color-primary)]/20" />

            {/* zarf kapağı - tıklanınca açılır */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 origin-top"
              style={{
                background: 'var(--color-primary)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
              whileHover={{ rotateX: -15 }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-serif text-lg md:text-xl text-[var(--color-text)] mt-8">
                {brideName} & {groomName}
              </p>
            </div>
          </motion.div>

          <p className="mt-8 text-xs tracking-[0.3em] uppercase text-[var(--color-text)]/50">
            Açmak için dokunun
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
