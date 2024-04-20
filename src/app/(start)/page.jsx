'use client';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
    const query = {
        _path: 'query',
        query: '{host=~".+"}',
    };

    const { data, error } = useQuery({
        queryKey: ['loki', query],
        queryFn: async () => fetch(`/api/loki?${new URLSearchParams(query)}`, {
            method: 'GET',
        }).then((res) => res.json()),
    });

    console.log(data);

    return (
        <main>
            loki frontend
        </main>
    );
}
