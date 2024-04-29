'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useShallow } from 'zustand/react/shallow';
import Result from '@/components/Result';
import useLabels from '@/hooks/useLabels';
import { useStore } from '@/hooks/useStore';

export default function Components() {
    const { selectedLabels, filterValues } = useLabels();
    const [overrideQuery, setOverrideQuery, settingsLoaded] = useStore(
        useShallow((state) => [state.overrideQuery, state.setOverrideQuery, state.settingsLoaded]),
    );

    const overrideInput = useRef(null);

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

        const defaultQuery = `{${filters.join(', ')}}`;

        return {
            query: overrideQuery || defaultQuery,
            defaultQuery,
            since,
        };
    }, [selectedLabels, filterValues, overrideQuery]);

    useMemo(() => {
        if (overrideInput.current) {
            overrideInput.current.value = query.query;
        }
    }, [overrideInput, query.query]);

    const {
        data: resultData, error, isLoading, isFetching,
    } = useQuery({
        queryKey: ['loki', query],
        queryFn: async () => {
            const res = await fetch(`/api/loki?${new URLSearchParams(query)}`, {
                headers: {
                    'X-Loki-Path': 'query_range',
                },
            });

            const data = await res.json();

            if (data?.error) {
                throw new Error(data.error);
            }

            return data?.data;
        },
        enabled: !!filterValues.start && !!query.query,
        refetchInterval: 15 * 1000,
        refetchIntervalInBackground: false,
    });

    const resultValues = useMemo(
        () => resultData
            ?.result
            ?.map((result) => result.values.map((value) => [...value, result.stream]))
            ?.reduce((acc, val) => acc.concat(val), [])
            ?.sort((a, b) => b[0] - a[0]),
        [resultData],
    );

    function onOverrideFormSubmit(e) {
        e.preventDefault();

        const data = new FormData(e.target);

        setOverrideQuery(data.get('query'));
    }

    function onOverrideReset() {
        setOverrideQuery(null);

        if (overrideInput.current) {
            overrideInput.current.value = query.defaultQuery;
        }
    }

    if (!settingsLoaded) {
        return null;
    }

    if (!filterValues.start) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                Select a date rang from the &apos;start&apos; dropdown.
            </div>
        );
    }

    if (!query) {
        return (
            <div className="flex justify-center items-center min-h-[16rem]">
                Select a label from the dropdowns above.
            </div>
        );
    }

    return (
        <>
            {isFetching && (
                <div className="fixed bottom-4 right-4 h-4 w-4 rounded-full bg-red-500" />
            )}

            <div className="p-4">
                <form onSubmit={(e) => onOverrideFormSubmit(e)}>
                    <label
                        htmlFor="query"
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Query
                        {' '}
                        {overrideQuery && '(overridden)'}
                        {overrideQuery && (
                            <button
                                type="button"
                                className="text-xs text-red-500 ml-2"
                                onClick={() => onOverrideReset()}
                            >
                                Reset
                            </button>
                        )}
                    </label>
                    <input
                        type="text"
                        className={classNames(
                            'font-mono text-xs border px-2 py-1 w-full dark:bg-transparent',
                            overrideQuery ? 'border-red-500' : 'border-gray-300 dark:border-gray-500',
                        )}
                        name="query"
                        ref={overrideInput}
                        defaultValue={query?.query}
                    />
                </form>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center min-h-[16rem]">
                    Loading...
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center min-h-[16rem]">
                    {`${error}`}
                </div>
            )}

            <div className="p-4">
                {resultValues?.length > 0 && (
                    <Result rows={resultValues} />
                )}
            </div>
        </>
    );
}
