import { create } from 'zustand';

export const useStore = create((set) => ({
    selectedLabels: [],
    selectLabel: (name, value) => set((state) => {
        const prev = state.selectedLabels;

        if (value === '*') {
            return {
                selectedLabels: prev.filter((label) => label.name !== name),
            };
        }

        if (prev.find((label) => label.name === name)) {
            return {
                selectedLabels: prev.map((label) => {
                    if (label.name === name) {
                        return { name, value };
                    }

                    return label;
                }),
            };
        }

        return { selectedLabels: [...prev, { name, value }] };
    }),
}));
