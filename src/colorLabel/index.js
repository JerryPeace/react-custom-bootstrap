import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CustomPropTypes from '../utils/CustomPropTypes';
import styleMaps from '../styleMaps';
import bootstrapUtils from '../utils/bootstrapUtils';
import classNames from 'classnames';

class ColorLabel extends Component {
    static propTypes = {
        bsClass: CustomPropTypes.keyOf(styleMaps.CLASSES),
        bsStyle: PropTypes.string
    };

    static defaultProps ={
        bsClass: styleMaps.CLASSES.label,
        bsStyle: 'light-gray'
    };

    render() {
        const {
            bsClass,
            bsStyle,
            children,
            ...props
        } = this.props;
        const bsCls = bootstrapUtils.getCls({ bsClass, bsStyle });

        return (<span className={classNames(bsCls)} {...props}>{children}</span>);
    }
}

export default ColorLabel;
