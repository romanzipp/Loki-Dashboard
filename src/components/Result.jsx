import React, { useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
    comp, className = '', title = undefined, children,
}) {
    const C = comp;

    return (
        <C
            title={title}
            className={classNames(className, 'px-1')}
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

function Tr({ className = '', title = undefined, children }) {
    return (
        <TableCol
            comp="tr"
            title={title}
            className={classNames(className, '')}
        >
            {children}
        </TableCol>
    );
}

Tr.propTypes = colProps;

// ---------------------------------------------------------------------------------------

function Td({ className = '', title = undefined, children }) {
    return (
        <TableCol
            comp="td"
            title={title}
            className={classNames(className, 'group-hover:bg-gray-200')}
        >
            {children}
        </TableCol>
    );
}

Td.propTypes = colProps;

// ---------------------------------------------------------------------------------------

function Result({ result }) {
    const rows = useMemo(() => {
        if (!result.values) {
            return [];
        }

        return result.values.map((row) => {
            const [timestamp, value] = row;
            const data = JSON.parse(value);

            return {
                key: `${timestamp}-${value}`,
                date: moment(data.datetime),
                data,
                classNameMap: levelClassNameMap[data.level] || levelClassNameMap[100],
            };
        });
    }, [result]);

    console.log(rows);

    return (
        <table>
            <thead className="text-sm uppercase font-medium bg-gray-100">
                <tr>
                    <td>Timestamp</td>
                    <td>Level</td>
                    <td>Message</td>
                </tr>
            </thead>
            <tbody className="text-xs">
                {rows.map((row) => (
                    <tr
                        key={row.key}
                        className="group"
                    >
                        <Td>
                            {row.date.format('YYYY-MM-DD HH:mm:ss')}
                        </Td>
                        <Td
                            title={row.data.level}
                            className={row.classNameMap.textClassName}
                        >
                            {row.data.level_name}
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

Result.propTypes = {};

export default Result;
