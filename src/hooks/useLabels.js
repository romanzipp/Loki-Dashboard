import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function useLabels() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function createQueryString(sp, items, prefix) {
        const params = new URLSearchParams(sp.toString());

        params.forEach((value, name) => {
            if (!name.startsWith(prefix)) {
                return;
            }

            params.delete(name);
        });

        items.forEach(({ name, value }) => {
            if (value === '*') {
                return;
            }

            params.set(`${prefix}[${name}]`, value);
        });

        return params.toString();
    }

    function filterQueryParamPrefix(prefix, key, params) {
        const match = key.match(RegExp(`${prefix}\\[(.+)\\]`));

        if (!match) {
            return null;
        }

        return {
            name: match[1],
            value: params.get(key),
        };
    }

    function refreshQueryState(name, value, selectedItems, prefix) {
        let items = [];

        if (value === '*') {
            items = selectedItems.filter((label) => label.name !== name);
        } else if (selectedItems.find((label) => label.name === name)) {
            items = selectedItems.map((label) => {
                if (label.name === name) {
                    return { name, value };
                }

                return label;
            });
        } else {
            items = [...selectedItems, { name, value }];
        }

        router.push(`${pathname}?${createQueryString(searchParams, items, prefix)}`);
    }

    const selectedFilters = useMemo(() => [...searchParams.keys()]
        .map((key) => filterQueryParamPrefix('filters', key, searchParams))
        .filter((filter) => filter !== null), [searchParams]);

    const selectedLabels = useMemo(() => [...searchParams.keys()]
        .map((key) => filterQueryParamPrefix('labels', key, searchParams))
        .filter((label) => label !== null), [searchParams]);

    const selectLabel = useCallback((name, value) => refreshQueryState(name, value, selectedLabels, 'labels'), [selectedLabels, pathname, searchParams]);

    const selectFilter = useCallback((name, value) => refreshQueryState(name, value, selectedFilters, 'filters'), [selectedLabels, pathname, searchParams]);

    const filterValues = useMemo(() => {
        const items = {};

        selectedFilters.forEach((filter) => {
            items[filter.name] = filter.value;
        });

        return items;
    }, [selectedFilters]);

    return {
        selectedLabels,
        selectLabel,
        selectedFilters,
        selectFilter,
        filterValues,
    };
}
