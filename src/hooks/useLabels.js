import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function useLabels() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback((items) => {
        const params = new URLSearchParams(searchParams.toString());

        params.forEach((value, name) => {
            params.delete(name);
        });

        items.forEach(({ name, value }) => {
            if (value === '*') {
                return;
            }

            params.set(`labels[${name}]`, value);
        });

        return params.toString();
    }, [searchParams]);

    const selectedLabels = useMemo(() => [...searchParams.keys()]
        .map((key) => {
            const match = key.match(/labels\[(.+)\]/);

            if (!match) {
                return null;
            }

            return {
                name: match[1],
                value: searchParams.get(key),
            };
        })
        .filter((label) => label !== null), [searchParams]);

    console.log('selectedLabels', selectedLabels);

    const selectLabel = useCallback((name, value) => {
        let finalLabels = [];

        if (value === '*') {
            finalLabels = selectedLabels.filter((label) => label.name !== name);
        } else if (selectedLabels.find((label) => label.name === name)) {
            finalLabels = selectedLabels.map((label) => {
                if (label.name === name) {
                    return { name, value };
                }

                return label;
            });
        } else {
            finalLabels = [...selectedLabels, { name, value }];
        }

        router.push(`${pathname}?${createQueryString(finalLabels)}`);
    }, [selectedLabels, pathname, searchParams]);

    return {
        selectedLabels,
        selectLabel,
    };
}
