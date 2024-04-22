import { create } from 'zustand';

export const useStore = create((set) => ({
    selectedLabels: [],
    setSelectedLabels: (selectedLabels) => set((state) => ({ selectedLabels })),
}));
