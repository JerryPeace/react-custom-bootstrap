import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const LabeledRow = (props) => {
    const {
        className,
        label,
        labelStyles,
        type,
        value,
        valueStyles,
        delayRendering,
        layoutFixed
    } = props;

    const rowClass = classNames('labeled-layout-row', `${type}-row`, className)

    if (_.isUndefined(label)) {
        // single column mode.
        return (
            <tr className={rowClass}>
                <td className='labeled-layout-value whole-row' colSpan={2}>{value}</td>
            </tr>
        );
    } else {
        const newValue = delayRendering ? (layoutFixed && value) : value;
        return (
            <tr className={rowClass}>
                <td className='labeled-layout-label' style={labelStyles}>{label}</td>
                <td className='labeled-layout-value' style={valueStyles}>{newValue}</td>
            </tr>
        );
    }
};

LabeledRow.propTypes = {
    className: PropTypes.string,
    delayRendering: PropTypes.bool,
    label: PropTypes.node,
    labelStyles: PropTypes.object,
    layoutFixed: PropTypes.bool,
    type: PropTypes.oneOf([
        'text',
        'rcb-component',
        'component'
    ]),
    value: PropTypes.node,
    valueStyles: PropTypes.object
};

LabeledRow.defaultProps = {
    type: 'text'
};

export default LabeledRow;
