import { create } from 'zustand';

export const useStore = create((set) => ({
    // Settings
    settingsLoaded: false,
    setSettingsLoaded: (settingsLoaded) => set(() => ({ settingsLoaded })),

    truncateLogs: false,
    setTruncateLogs: (truncateLogs) => set(() => ({ truncateLogs })),

    // Query override
    overrideQuery: null,
    setOverrideQuery: (overrideQuery) => set(() => ({ overrideQuery })),
}));
