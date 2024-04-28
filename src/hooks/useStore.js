import { create } from 'zustand';

export const useStore = create((set) => ({
    overrideQuery: null,
    setOverrideQuery: (overrideQuery) => set((state) => ({ overrideQuery })),
}));
