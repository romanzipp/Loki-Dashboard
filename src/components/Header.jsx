import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/store';
import LabelDropdown from '@/components/LabelDropdown';

function Header() {
    const [selectedLabels, selectLabel] = useStore(
        useShallow((state) => [state.selectedLabels, state.selectLabel]),
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

    function onSelect(label, value) {
        selectLabel(label, value);
    }

    console.log(selectedLabels);

    const computedLabels = useMemo(() => labels?.map((label) => ({
        name: label,
        values: labelValues?.find((lv) => lv.label === label)?.values || [],
        selectedValue: selectedLabels.find((l) => l.name === label)?.value,
    })), [labels, labelValues, selectedLabels]);

    return (
        <nav className="bg-[#23232A] p-2 text-white items-center flex gap-4">
            <div className="font-semibold">
                Loki Dashboard
            </div>
            <div className="flex gap-2 text-xs items-center">
                {computedLabels?.map((label) => (
                    <LabelDropdown
                        label={label}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </nav>
    );
}

Header.propTypes = {};

export default Header;
