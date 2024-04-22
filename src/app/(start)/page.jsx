'use client';

import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Result from '@/components/Result';
import { useStore } from '@/store';

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedLabels = useStore((state) => state.selectedLabels);

    const query = useMemo(() => {
        const filters = selectedLabels.map(({ name, value }) => `${name}="${value}"`);

        if (filters.length === 0) {
            return null;
        }

        return {
            query: `{ ${filters.join(', ')} }`,
        };
    }, [selectedLabels]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.forEach((value, name) => {
            params.delete(name);
        });

        selectedLabels.forEach(({ name, value }) => {
            if (value === '*') {
                return;
            }

            params.set(name, value);
        });

        const qs = params.toString();

        router.push(`${pathname}?${qs}`);
    }, [selectedLabels, pathname]);

    console.log(query);

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
