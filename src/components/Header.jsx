import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/store';

function Header() {
    const [selectedLabels, setSelectedLabels] = useStore(
        useShallow((state) => [state.selectedLabels, state.setSelectedLabels]),
    );

    const { data: labels } = useQuery({
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

    console.log(labelValues);

    const computedLabels = useMemo(() => labels?.map((label) => ({
        name: label,
        values: labelValues?.find((lv) => lv.label === label)?.values || [],
        selected: selectedLabels.includes(label),
    })), [labels, labelValues, selectedLabels]);

    return (
        <nav className="bg-[#23232A] p-2 text-white flex gap-4">
            <div className="font-semibold">
                Loki Dashboard
            </div>
            <div className="flex gap-2 text-xs items-center">
                {computedLabels?.map((label) => (
                    <div
                        key={label.name}
                        className="border border-gray-600 px-2 py-1"
                    >
                        {label.name}

                        {label.values.map((value) => (
                            <div key={value}>
                                {value}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </nav>
    );
}

Header.propTypes = {};

export default Header;
