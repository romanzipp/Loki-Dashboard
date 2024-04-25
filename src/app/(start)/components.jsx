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
                'now-3d': '3d',
                'now-7d': '7d',
                'now-14d': '14d',
                'now-30d': '30d',
            }[filterValues.start];
        }

        return {
            query: `{${filters.join(', ')}}`,
            since,
        };
    }, [selectedLabels, filterValues]);

    const {
        data: resultData, error, isLoading, isFetching,
    } = useQuery({
        queryKey: ['loki', query],
        queryFn: async () => fetch(`/api/loki?${new URLSearchParams(query)}`, {
            headers: {
                'X-Loki-Path': 'query_range',
            },
        })
            .then((res) => res.json())
            .then((res) => res.data),
        enabled: query !== null,
        refetchInterval: 15 * 1000,
        refetchIntervalInBackground: false,
    });

    const resultValues = useMemo(() => resultData?.result?.map((result) => result.values).reduce((acc, val) => acc.concat(val), []).sort((a, b) => b[0] - a[0]), [resultData]);

    if (!query) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                Select a label from the dropdowns above.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                {error}
            </div>
        );
    }

    return (
        <>
            {isFetching && (
                <div className="fixed bottom-4 right-4 h-4 w-4 rounded-full bg-red-500" />
            )}
            <div className="p-4">
                {resultValues?.length > 0 && (
                    <Result rows={resultValues} />
                )}
            </div>
        </>
    );
}
