'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Result from '@/components/Result';
import useLabels from '@/hooks/useLabels';

export default function Components() {
    const { selectedLabels, filterValues } = useLabels();

    const query = useMemo(() => {
        const filters = selectedLabels.map(({ name, value }) => `${name}="${value}"`);

        if (filters.length === 0) {
            return null;
        }

        let since = null;

        if (filterValues.start) {
            since = {
                'now-1h': '1h',
                'now-3h': '3h',
                'now-12h': '12h',
                'now-1d': '1d',
            }[filterValues.start];
        }

        return {
            query: `{${filters.join(', ')}}`,
            since,
        };
    }, [selectedLabels, filterValues]);

    const { data: resultData } = useQuery({
        queryKey: ['loki', query],
        queryFn: async () => fetch(`/api/loki?${new URLSearchParams(query)}`, {
            headers: {
                'X-Loki-Path': 'query_range',
            },
        })
            .then((res) => res.json())
            .then((res) => res.data),
        enabled: query !== null,
    });

    const resultValues = useMemo(() => resultData?.result?.map((result) => result.values).reduce((acc, val) => acc.concat(val), []), [resultData]);

    if (!query) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                Select a label from the dropdowns above.
            </div>
        );
    }

    return (
        <div className="p-4">
            {resultValues?.length > 0 && (
                <Result rows={resultValues} />
            )}
        </div>
    );
}
