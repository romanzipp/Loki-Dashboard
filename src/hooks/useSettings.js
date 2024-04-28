/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/hooks/useStore';

const SET_TRUNCATE = 'settings_truncate_logs';

export default function useSettings() {
    const [lastChanged, setLastChanged] = useState(null);

    const [truncateLogs, setTruncateLogs, setSettingsLoaded] = useStore(
        useShallow((state) => [state.truncateLogs, state.setTruncateLogs, state.setSettingsLoaded]),
    );

    useEffect(() => {
        if (!localStorage) {
            return;
        }

        setTruncateLogs((SET_TRUNCATE in localStorage) && localStorage[SET_TRUNCATE] === '1');

        setSettingsLoaded(true);
    }, [lastChanged]);

    function changeSettings(key, value) {
        if (!localStorage) {
            return;
        }

        localStorage[key] = value;
        setLastChanged(+new Date());
    }

    return {
        truncateLogs,
        setTruncateLogs: (value) => changeSettings(SET_TRUNCATE, value ? 1 : 0),
    };
}
