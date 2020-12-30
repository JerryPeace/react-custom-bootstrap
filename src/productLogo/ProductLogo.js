import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class ProductLogo extends Component {

    static propTypes = {
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'banner',
        bsStyle: 'header'
    };

    render () {
        const {
            bsClass,
            children,
            className
        } = this.props;

        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <header className={classNames(className, bsCls)}>
                <h4 className={`${bsClass}-logo`}>{children}</h4>
            </header>
        );
    }
}

export default ProductLogo;
