import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { Td } from '@/components/Table';

function prettifyValue(value) {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        return value;
    }

    try {
        return JSON.stringify(JSON.parse(value), undefined, 4);
    } catch (err) {
        return `${value}`;
    }
}

function ResultRow({ row, truncate = false }) {
    const [expanded, setExpanded] = useState(false);

    function onExpand(e) {
        if (e.target.tagName === 'PRE') {
            return;
        }

        setExpanded(!expanded);
    }

    const displayLabels = row.labels.filter((label) => !label.fromStream).map((label) => ({
        ...label,
        prettyValue: prettifyValue(label.value),
    }));

    const expandedLabels = useMemo(() => {
        if (!expanded) {
            return [];
        }

        return row
            .labels
            .map((label) => ({
                ...label,
                prettyValue: prettifyValue(label.value),
            }));
    }, [expanded, row]);

    return (
        <tr
            onClick={(e) => onExpand(e)}
            className={classNames(
                row.hasBackground && [row.classNameMap.bgClassName, 'text-white'],
                expanded && 'bg-gray-100 dark:bg-gray-800',
                'group cursor-pointer',
            )}
        >
            <Td collapse>
                {row.date.format('YYYY-MM-DD HH:mm:ss')}
            </Td>
            <Td
                collapse
                title={row.data.level}
            >
                <span className={classNames(row.hasBackground ? '' : row.classNameMap.textClassName, 'px-2 py-[px]')}>
                    {row.data.level_name}
                </span>
            </Td>
            <Td collapse>
                <div className="flex gap-1">
                    {displayLabels.map((label) => (
                        <div
                            key={label.key}
                            className={classNames('px-1', row.hasBackground ? 'bg-black/30' : label.colorClassName.bg)}
                        >
                            <span className="mr-1 font-medium">
                                {label.key}
                            </span>
                            <span className={`opacity-80 ${label.truncated ? 'italic' : ''}`}>
                                {label.truncated ? 'truncated' : label.prettyValue}
                            </span>
                        </div>
                    ))}
                </div>
            </Td>
            <Td>
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className={classNames('w-4 h-4 inline', expanded && 'rotate-90')}
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className={truncate ? 'truncate' : 'whitespace-normal'}>
                        {row.data.message}
                    </span>
                </div>
                {expanded && (
                    <div className="mt-2">
                        {expandedLabels.map((label) => (
                            <pre
                                key={label.key}
                                className={`relative mb-2 border-l-4 pl-2 break-words whitespace-pre-wrap text-xs ${label.colorClassName.border}`}
                            >
                                <div className={`left-0 top-[50%] absolute pr-3 -translate-x-full -translate-y-1/2 ${label.colorClassName.text}`}>
                                    {label.key}
                                </div>
                                {label.prettyValue}
                            </pre>
                        ))}
                        <pre className="border-l-4 pl-2 border-gray-400 whitespace-pre-wrap break-words">{JSON.stringify(row.data, undefined, 4)}</pre>
                    </div>
                )}
            </Td>
        </tr>
    );
}

ResultRow.propTypes = {};

export default ResultRow;
