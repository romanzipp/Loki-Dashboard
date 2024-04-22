import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useConfig() {
    const { data: config } = useQuery({
        queryKey: ['config'],
        queryFn: () => fetch('/api/config').then((res) => res.json()),
    });

    return config || {
        coloredRows: false,
        coloredRowsLevelThreshold: null,
    };
}
