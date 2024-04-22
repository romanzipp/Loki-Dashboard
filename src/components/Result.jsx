import React, { useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import useLabels from '@/hooks/useLabels';

const levelClassNameMap = {
    100: {
        levels: ['debug'],
        textClassName: 'text-gray-500',
    },
    200: {
        levels: ['info'],
        textClassName: 'text-blue-600',
    },
    250: {
        levels: ['notice'],
        textClassName: 'text-sky-600',
    },
    300: {
        levels: ['warning'],
        textClassName: 'text-orange-600',
    },
    400: {
        levels: ['error', 'err'],
        textClassName: 'text-orange-600',
    },
    500: {
        levels: ['critical'],
        textClassName: 'text-red-600',
    },
    550: {
        levels: ['alert'],
        textClassName: 'text-red-600',
    },
    600: {
        levels: ['emergency'],
        textClassName: 'text-red-600',
    },
};

// ---------------------------------------------------------------------------------------

const colProps = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
};

// ---------------------------------------------------------------------------------------

function TableCol({
    comp, className = '', title = undefined, collapse = false, children,
}) {
    const C = comp;

    return (
        <C
            title={title}
            className={classNames(className, collapse && 'w-0 whitespace-nowrap', 'px-1')}
        >
            {children}
        </C>
    );
}

TableCol.propTypes = {
    comp: PropTypes.string.isRequired,
    ...colProps,
};

// ---------------------------------------------------------------------------------------

function Th({
    className = '', title = undefined, collapse = false, children,
}) {
    return (
        <TableCol
            comp="th"
            title={title}
            collapse={collapse}
            className={classNames(className, 'text-left font-medium')}
        >
            {children}
        </TableCol>
    );
}

Th.propTypes = colProps;

// ---------------------------------------------------------------------------------------

function Td({
    className = '', title = undefined, collapse = false, children,
}) {
    return (
        <TableCol
            comp="td"
            title={title}
            collapse={collapse}
            className={classNames(className, 'group-hover:bg-gray-200')}
        >
            {children}
        </TableCol>
    );
}

Td.propTypes = colProps;

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
                classNameMap: levelClassNameMap[data.level] || levelClassNameMap[100],
            };
        });
    }, [rows]);

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
                    <tr
                        key={row.key}
                        className="group"
                    >
                        <Td collapse>
                            {row.date.format('YYYY-MM-DD HH:mm:ss')}
                        </Td>
                        <Td
                            collapse
                            title={row.data.level}
                            className={row.classNameMap.textClassName}
                        >
                            {row.data.level_name}
                        </Td>
                        <Td collapse>
                            <div className="flex gap-1">
                                {row.labels.map((label) => (
                                    <div
                                        key={label.key}
                                        className={classNames('bg-gray-200 px-1', label.bgClassName)}
                                    >
                                        <span className="mr-1 font-medium">
                                            {label.key}
                                        </span>
                                        <span className="opacity-80">
                                            {label.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Td>
                        <Td>
                            {row.data.message}
                        </Td>
                    </tr>
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
