'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useShallow } from 'zustand/react/shallow';
import Result from '@/components/Result';
import useLabels from '@/hooks/useLabels';
import { useStore } from '@/hooks/useStore';
import useSettings from '@/hooks/useSettings';

export default function Components() {
    const { selectedLabels, filterValues } = useLabels();
    const { truncateLogs } = useSettings();
    const [overrideQuery, setOverrideQuery, settingsLoaded] = useStore(
        useShallow((state) => [state.overrideQuery, state.setOverrideQuery, state.settingsLoaded]),
    );

    // -----------------------------------------------------------------------------
    // Filters

    const limit = 100;

    const overrideInput = useRef(null);

    const [query, defaultQuery] = useMemo(() => {
        const filters = selectedLabels.map(({ name, value }) => `${name}="${value}"`);

        if (filters.length === 0) {
            return [null, null];
        }

        const returnDefaultQuery = `{${filters.join(', ')}}`;

        const returnQuery = {
            query: overrideQuery || returnDefaultQuery,
            limit,
        };

        if (filterValues.start) {
            returnQuery.since = {
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

        return [returnQuery, returnDefaultQuery];
    }, [selectedLabels, filterValues, overrideQuery]);

    useMemo(() => {
        if (overrideInput.current) {
            overrideInput.current.value = query?.query;
        }
    }, [overrideInput, query?.query]);

    // -----------------------------------------------------------------------------
    // API

    const {
        data: resultData,
        error,
        isLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ['loki', query],
        queryFn: async ({ pageParam }) => {
            const sendQuery = { ...query };

            if (pageParam) {
                sendQuery.end = pageParam;
                // sendQuery.start = (Math.round(pageParam / 1000000) - (86400 * 4)) * 1000000;
                // sendQuery.since = '12h';
            }

            const res = await fetch(`/api/loki?${new URLSearchParams(sendQuery)}`, {
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
        enabled: !!query?.query, // !!filterValues.start &&
        refetchInterval: 15 * 1000,
        refetchIntervalInBackground: false,
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            const values = lastPage
                ?.result
                ?.map((result) => result.values.map((value) => [...value, result.stream]))
                ?.reduce((acc, val) => acc.concat(val), [])
                ?.sort((a, b) => b[0] - a[0]);

            if (values?.length > 0) {
                // console.log('getNextPageParam', new Date(Math.round(values[values.length - 1][0] / 1000000)));
                return values[values.length - 1][0];
            }

            return null;
        },
    });

    const resultValues = useMemo(() => {
        const results = resultData?.pages?.map((page) => page.result)?.flat();

        const values = results?.map((result) => result.values.map((value) => [...value, result.stream]))
            ?.reduce((acc, val) => acc.concat(val), [])
            ?.sort((a, b) => b[0] - a[0]);

        return values;
    }, [resultData]);

    // -----------------------------------------------------------------------------
    // Callbacks

    function onOverrideFormSubmit(e) {
        e.preventDefault();

        const data = new FormData(e.target);

        setOverrideQuery(data.get('query'));
    }

    function onOverrideReset() {
        setOverrideQuery(null);

        if (overrideInput.current) {
            overrideInput.current.value = defaultQuery;
        }
    }

    // -----------------------------------------------------------------------------
    // Render

    if (!settingsLoaded) {
        return null;
    }

    // if (!filterValues.start) {
    //     return (
    //         <div className="flex justify-center items-center min-h-[16rem]">
    //             Select a date rang from the &apos;start&apos; dropdown.
    //         </div>
    //     );
    // }

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

            <div className={classNames('p-4', truncateLogs ? 'max-w-full truncate' : '')}>
                {resultValues?.length > 0 && (
                    <>
                        <Result
                            rows={resultValues}
                            loadMore={() => fetchNextPage()}
                        />
                        <button
                            onClick={() => fetchNextPage()}
                            type="button"
                            className="block w-full text-center text-gray-500 py-8 hover:bg-gray-100"
                        >
                            {isFetchingNextPage ? 'Loading next results...' : (hasNextPage ? 'Load more rows' : 'End reached.')}
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
