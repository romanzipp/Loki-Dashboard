import PropTypes from 'prop-types';
import classNames from 'classnames';

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
            className={classNames(className, collapse && 'w-0 whitespace-nowrap', 'px-1 align-top')}
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

function ThComp({
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

ThComp.propTypes = colProps;

export const Th = ThComp;

// ---------------------------------------------------------------------------------------

function TdComp({
    className = '', title = undefined, collapse = false, children,
}) {
    return (
        <TableCol
            comp="td"
            title={title}
            collapse={collapse}
            className={classNames(className, 'group-hover:bg-gray-100')}
        >
            {children}
        </TableCol>
    );
}

TdComp.propTypes = colProps;

export const Td = TdComp;
