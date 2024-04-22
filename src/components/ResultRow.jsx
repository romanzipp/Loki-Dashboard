import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { Td } from '@/components/Table';

function ResultRow({ row }) {
    const [expanded, setExpanded] = useState(false);

    const prettyException = useMemo(() => {
        if (!row.exception) {
            return null;
        }

        try {
            return JSON.stringify(JSON.parse(row.exception), undefined, 4);
        } catch (err) {
            return row.exception;
        }
    }, [row]);

    return (
        <tr
            className={classNames(
                row.hasBackground && [row.classNameMap.bgClassName, 'text-white'],
                'group',
            )}
        >
            <Td collapse>
                {row.date.format('YYYY-MM-DD HH:mm:ss')}
            </Td>
            <Td
                collapse
                title={row.data.level}
                className={row.hasBackground ? '' : row.classNameMap.textClassName}
            >
                {row.data.level_name}
            </Td>
            <Td collapse>
                <div className="flex gap-1">
                    {row.labels.map((label) => (
                        <div
                            key={label.key}
                            className={classNames('bg-gray-200 px-1', row.hasBackground ? 'bg-black/30' : label.bgClassName)}
                        >
                            <span className="mr-1 font-medium">
                                {label.key}
                            </span>
                            <span className={`opacity-80 ${label.truncated ? 'italic' : ''}`}>
                                {label.truncated ? '[truncated]' : label.value}
                            </span>
                        </div>
                    ))}
                </div>
            </Td>
            <Td>
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center"
                >
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
                    {row.data.message}
                </button>
                {expanded && (
                    <>
                        {row.exception && (
                            <pre className="mb-2 border-l-4 pl-2 border-red-400 break-words whitespace-pre-wrap text-xs">{prettyException}</pre>
                        )}
                        <pre className="border-l-4 pl-2 border-gray-400 whitespace-pre-wrap break-words">{JSON.stringify(row.data, undefined, 4)}</pre>
                    </>
                )}
            </Td>
        </tr>
    );
}

ResultRow.propTypes = {};

export default ResultRow;
