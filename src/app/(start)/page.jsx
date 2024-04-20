'use client';

import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import Result from '@/components/Result';

export default function Home() {
    const query = {
        query: '{host=~".+"}',
    };

    const { data } = useQuery({
        queryKey: ['loki', query],
        queryFn: async () => fetch(`/api/loki?${new URLSearchParams(query)}`, {
            headers: {
                'X-Loki-Path': 'query_range',
            },
        }).then((res) => res.json()),
    });

    return (
        <div className="p-4">
            {data?.data?.result?.length > 0 && data.data.result.map((result) => (
                <Fragment key={JSON.stringify(result.stream)}>
                    <Result result={result} />
                </Fragment>
            ))}
        </div>
    );
}
