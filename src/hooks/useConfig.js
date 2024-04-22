import { useQuery } from '@tanstack/react-query';

export default function useConfig() {
    const { data: config } = useQuery({
        queryKey: ['config'],
        queryFn: () => fetch('/api/config').then((res) => res.json()),
    });

    const defaultConfig = {
        coloredRows: false,
        coloredRowsLevelThreshold: null,
        labelCharLimit: 26,
    };

    return { ...defaultConfig, ...config };
}
