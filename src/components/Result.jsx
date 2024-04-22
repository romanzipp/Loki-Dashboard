import React, { useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import useLabels from '@/hooks/useLabels';
import useConfig from '@/hooks/useConfig';
import ResultRow from '@/components/ResultRow';
import { Th } from '@/components/Table';

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

const internalRowKeys = ['datetime', 'extra', 'level', 'level_name', 'message', exceptionKey];

const labelColors = [
    'bg-teal-500/15',
    'bg-sky-500/15',
    'bg-indigo-500/15',
    'bg-purple-500/15',
    'bg-fuchsia-500/15',
    'bg-rose-500/15',
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
                        bgClassName: labelColors[index % labelColors.length],
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
