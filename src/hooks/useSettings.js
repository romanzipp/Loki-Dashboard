/* eslint-disable no-undef */
import { useState, useEffect } from 'react';

const SET_TRUNCATE = 'settings_truncate_logs';

export default function useSettings() {
    const [lastChanged, setLastChanged] = useState(null);

    const [truncateLogs, setTruncateLogs] = useState(false);

    function listener() {
        setLastChanged(+new Date());
    }

    useEffect(() => {
        if (!localStorage) {
            return;
        }

        setTruncateLogs((SET_TRUNCATE in localStorage) && localStorage[SET_TRUNCATE] === '1');
    }, [lastChanged]);

    function changeSettings(key, value) {
        if (!localStorage) {
            return;
        }

        localStorage[key] = value;
        setLastChanged(+new Date());
        window.dispatchEvent(new CustomEvent('settings'));
    }

    useEffect(() => {
        window.addEventListener('settings', listener);

        return () => {
            window.removeEventListener('settings', listener);
        };
    }, []);

    return {
        truncateLogs,
        setTruncateLogs: (value) => changeSettings(SET_TRUNCATE, value ? 1 : 0),
    };
}
