'use client';

import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import Result from '@/components/Result';

export default function Home() {
    const query = {
        query: '{host=~".+"}',
    };

    const { data: resultData } = useQuery({
        queryKey: ['loki', query],
        queryFn: async () => fetch(`/api/loki?${new URLSearchParams(query)}`, {
            headers: {
                'X-Loki-Path': 'query_range',
            },
        })
            .then((res) => res.json())
            .then((res) => res.data),
    });

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
