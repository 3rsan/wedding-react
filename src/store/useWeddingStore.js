import { create } from 'zustand'

export const useWeddingStore = create((set) => ({
  wedding: null,
  guest: null,
  envelopeOpened: false,

  setWedding: (wedding) => set({ wedding }),
  setGuest: (guest) => set({ guest }),
  openEnvelope: () => set({ envelopeOpened: true }),
}))
