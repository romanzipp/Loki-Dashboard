import React, { useMemo, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import LabelDropdown from '@/components/LabelDropdown';
import useLabels from '@/hooks/useLabels';
import FilterDropdown from '@/components/FilterDropdown';

function Header() {
    const {
        selectedLabels, selectLabel,
        filterValues, selectFilter,
    } = useLabels();

    const { data: labels, error: labelsError, isLoading: labelsLoading } = useQuery({
        queryKey: ['loki', 'labels'],
        queryFn: async () => fetch('/api/loki', {
            headers: {
                'X-Loki-Path': 'labels',
            },
        })
            .then((res) => res.json())
            .then((res) => res.data),
    });

    const { data: labelValues } = useQuery({
        queryKey: ['label-values', labels],
        queryFn: async () => Promise.all(
            labels?.map((async (label) => {
                const res = await fetch('/api/loki', {
                    headers: {
                        'X-Loki-Path': `label/${label}/values`,
                    },
                });

                const data = await res.json();

                return {
                    label,
                    values: data.data,
                };
            })),
        ),
    });

    function onSelect(label, value) {
        selectLabel(label, value);
    }

    const computedLabels = useMemo(() => labels?.map((label) => ({
        name: label,
        values: labelValues?.find((lv) => lv.label === label)?.values || [],
        selectedValue: selectedLabels.find((l) => l.name === label)?.value,
    })), [labels, labelValues, selectedLabels]);

    return (
        <nav className="bg-gray-800 p-2 text-white items-center flex gap-4">
            <div className="font-semibold whitespace-nowrap">
                Loki Dashboard
            </div>
            <div className="flex gap-2 text-xs items-center flex-wrap">
                <FilterDropdown
                    name="start"
                    values={['now-1h', 'now-3h', 'now-12h', 'now-1d', 'now-3d', 'now-7d', 'now-14d', 'now-30d']}
                    selectedValue={filterValues.start}
                    onSelect={(value) => selectFilter('start', value)}
                />

                {labelsLoading && (
                    <div className="pl-4">
                        loading labels...
                    </div>
                )}

                {labelsError && (
                    <div>
                        Error loading labels. See console for more information.
                    </div>
                )}

                {computedLabels?.map((label) => (
                    <Fragment key={label.name}>
                        <LabelDropdown
                            label={label}
                            onSelect={(name, value) => onSelect(name, value)}
                        />
                    </Fragment>
                ))}
            </div>
        </nav>
    );
}

Header.propTypes = {};

export default Header;
