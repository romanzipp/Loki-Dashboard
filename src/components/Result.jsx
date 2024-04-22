import React, { useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import useLabels from '@/hooks/useLabels';
import useConfig from '@/hooks/useConfig';
import ResultRow from '@/components/ResultRow';
import { Th } from '@/components/Table';
import { randomItemWithSeed } from '@/lib/utils';

const levelClassNameMap = {
    100: {
        levels: ['debug'],
        textClassName: 'text-gray-500',
        bgClassName: 'bg-gray-500',
    },
    200: {
        levels: ['info'],
        textClassName: 'text-blue-600',
        bgClassName: 'bg-blue-600',
    },
    250: {
        levels: ['notice'],
        textClassName: 'text-sky-600',
        bgClassName: 'bg-sky-600',
    },
    300: {
        levels: ['warning'],
        textClassName: 'text-orange-600',
        bgClassName: 'bg-orange-600',
    },
    400: {
        levels: ['error', 'err'],
        textClassName: 'text-orange-600',
        bgClassName: 'bg-orange-600',
    },
    500: {
        levels: ['critical'],
        textClassName: 'text-red-600',
        bgClassName: 'bg-red-600',
    },
    550: {
        levels: ['alert'],
        textClassName: 'text-red-600',
        bgClassName: 'bg-red-600',
    },
    600: {
        levels: ['emergency'],
        textClassName: 'text-red-600',
        bgClassName: 'bg-red-600',
    },
};

// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------

const exceptionKey = 'exception';

const internalRowKeys = ['datetime', 'extra', 'level', 'level_name', 'message'];

const labelColors = [
    { bg: 'bg-teal-500/10', border: 'border-teal-500/40', text: 'text-teal-700/80' },
    { bg: 'bg-sky-500/10', border: 'border-sky-500/40', text: 'text-sky-700/80' },
    { bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', text: 'text-indigo-700/80' },
    { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-700/80' },
    { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/40', text: 'text-fuchsia-700/80' },
    { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-700/80' },
    { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-700/80' },
    { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-700/80' },
    { bg: 'bg-lime-500/10', border: 'border-lime-500/40', text: 'text-lime-700/80' },
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-700/80' },
];

function Result({ rows }) {
    const { selectedLabels } = useLabels();
    const config = useConfig();

    const computedRows = useMemo(() => {
        if (!rows) {
            return [];
        }

        return rows.map((row) => {
            const [timestamp, value] = row;
            const data = JSON.parse(value);

            return {
                key: `${timestamp}-${value}`,
                date: moment(data.datetime),
                data,
                labels: Object
                    .keys(data)
                    .filter((key) => !internalRowKeys.includes(key))
                    .filter((key) => !selectedLabels.some((label) => label.value === data[key]))
                    .map((key, index) => ({
                        key,
                        value: data[key],
                        index,
                        truncated: data[key].length > 27,
                        colorClassName: randomItemWithSeed(labelColors, key.split('').reduce((acc, val) => acc + val.charCodeAt(0), 0)),
                    })),
                exception: data[exceptionKey],
                classNameMap: levelClassNameMap[data.level] || levelClassNameMap[100],
                hasBackground: config.coloredRows && (!config.coloredRowsLevelThreshold || data.level >= config.coloredRowsLevelThreshold),
            };
        });
    }, [rows, config]);

    return (
        <table className="w-full">
            <thead className="text-sm uppercase font-medium bg-gray-100">
                <tr>
                    <Th>Timestamp</Th>
                    <Th>Level</Th>
                    <Th>Labels</Th>
                    <Th>Message</Th>
                </tr>
            </thead>
            <tbody className="text-xs">
                {computedRows.map((row) => (
                    <ResultRow row={row} />
                ))}
            </tbody>
        </table>
    );
}

Result.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rows: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default Result;
