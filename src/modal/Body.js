import PropTypes from 'prop-types';
import React, { Component } from 'react';
import bootstrapUtils from '../utils/bootstrapUtils';
import classNames from 'classnames';

class Body extends Component {
    static propTypes = {
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'modal-body'
    };

    render() {
        const {className, children} = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div className={classNames(className, bsCls)}>
                {children}
            </div>
        );
    }
}

export default Body;
