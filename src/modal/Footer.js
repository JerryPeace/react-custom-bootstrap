import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class Footer extends Component {
    static propTypes = {
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'modal-footer'
    };

    render() {
        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div className={classNames(this.props.className, bsCls)}>
                {this.props.children}
            </div>
        );
    }
}

export default Footer;
