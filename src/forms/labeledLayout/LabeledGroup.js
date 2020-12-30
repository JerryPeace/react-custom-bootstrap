import PropTypes from 'prop-types';
import React from 'react';

const LabeledGroup = (props) => {
    const {
        children,
        labelStyles,
        valueStyles,
        layoutFixed,
        ...restProps
    } = props;
    const mappedChildren = (labelStyles || valueStyles) ? React.Children.map(children, (node) => {
        return React.cloneElement(node, {
            labelStyles,
            valueStyles,
            layoutFixed
        });
    }) : children;

    return (<tbody {...restProps}>{mappedChildren}</tbody>);
};

LabeledGroup.propTypes = {
    labelStyles: PropTypes.object,
    valueStyles: PropTypes.object,
    layoutFixed: PropTypes.bool
};

export default LabeledGroup;
