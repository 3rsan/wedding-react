// Bu temada zarf animasyonu yok, sayfa direkt açılır.
import { useEffect } from 'react';
import { useWeddingStore } from '../../store/useWeddingStore';

export default function Envelope() {
  const openEnvelope = useWeddingStore((s) => s.openEnvelope);

  useEffect(() => {
    openEnvelope();
  }, []);

  return null;
}
