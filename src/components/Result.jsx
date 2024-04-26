import React, { useMemo, Fragment } from 'react';
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
    { bg: 'bg-teal-500/10 dark:bg-teal-700/40', border: 'border-teal-500/40 border-teal-500/60', text: 'text-teal-700/80 dark:text-teal-500/90' },
    { bg: 'bg-sky-500/10 dark:bg-sky-700/40', border: 'border-sky-500/40 border-sky-500/60', text: 'text-sky-700/80 dark:text-sky-500/90' },
    { bg: 'bg-indigo-500/10 dark:bg-indigo-700/40', border: 'border-indigo-500/40 border-indigo-500/60', text: 'text-indigo-700/80 dark:text-indigo-500/90' },
    { bg: 'bg-purple-500/10 dark:bg-purple-700/40', border: 'border-purple-500/40 border-purple-500/60', text: 'text-purple-700/80 dark:text-purple-500/90' },
    { bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-700/40', border: 'border-fuchsia-500/40 border-fuchsia-500/60', text: 'text-fuchsia-700/80 dark:text-fuchsia-500/90' },
    { bg: 'bg-rose-500/10 dark:bg-rose-700/40', border: 'border-rose-500/40 border-rose-500/60', text: 'text-rose-700/80 dark:text-rose-500/90' },
    { bg: 'bg-red-500/10 dark:bg-red-700/40', border: 'border-red-500/40 border-red-500/60', text: 'text-red-700/80 dark:text-red-500/90' },
    { bg: 'bg-amber-500/10 dark:bg-amber-700/40', border: 'border-amber-500/40 border-amber-500/60', text: 'text-amber-700/80 dark:text-amber-500/90' },
    { bg: 'bg-lime-500/10 dark:bg-lime-700/40', border: 'border-lime-500/40 border-lime-500/60', text: 'text-lime-700/80 dark:text-lime-500/90' },
    { bg: 'bg-emerald-500/10 dark:bg-emerald-700/40', border: 'border-emerald-500/40 border-emerald-500/60', text: 'text-emerald-700/80 dark:text-emerald-500/90' },
];

function Result({ rows }) {
    const { selectedLabels } = useLabels();
    const config = useConfig();

    const computedRows = useMemo(() => {
        if (!rows) {
            return [];
        }

        return rows.map((row) => {
            const [timestamp, value, stream] = row;
            const data = JSON.parse(value);

            const labels = Object.assign(stream, data);

            return {
                key: `${timestamp}-${value}`,
                date: moment(data.datetime),
                data,
                labels: Object
                    .keys(labels)
                    .filter((key) => !internalRowKeys.includes(key))
                    .filter((key) => !selectedLabels.some((label) => label.value === labels[key]))
                    .map((key, index) => ({
                        key,
                        value: labels[key],
                        index,
                        fromStream: key in stream && !(key in data),
                        truncated: labels[key].length > config.labelCharLimit,
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
            <thead className="text-sm uppercase font-medium bg-gray-100 dark:bg-gray-800">
                <tr>
                    <Th>Timestamp</Th>
                    <Th>Level</Th>
                    <Th>Labels</Th>
                    <Th>Message</Th>
                </tr>
            </thead>
            <tbody className="text-xs">
                {computedRows.map((row) => (
                    <Fragment key={row.key}>
                        <ResultRow row={row} />
                    </Fragment>
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
