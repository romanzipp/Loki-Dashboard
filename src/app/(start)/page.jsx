'use client';

import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';
import Result from '@/components/Result';
import useLabels from '@/hooks/useLabels';

export default function Home() {
    const { selectedLabels, filterValues } = useLabels();

    const query = useMemo(() => {
        const filters = selectedLabels.map(({ name, value }) => `${name}="${value}"`);

        if (filters.length === 0) {
            return null;
        }

        let end = null;

        if (filterValues.start) {
            end = (+new Date()) - 10000000;
        }

        return {
            query: `{ ${filters.join(', ')} }`,
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

    if (!query) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                Select a label from the dropdowns above.
            </div>
        );
    }

    return (
        <div className="p-4">
            {resultData?.result?.length > 0 && resultData.result.map((result) => (
                <Fragment key={JSON.stringify(result.stream)}>
                    <Result result={result} />
                </Fragment>
            ))}
        </div>
    );
}
