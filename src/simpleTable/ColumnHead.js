import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

export default class ColumnHead extends Component {
    static propTypes = {
        className: PropTypes.string,
        headIdx: PropTypes.number,
    };

    static defaultProps = {
        className: '',
    };

    render() {
        const { children, headIdx, className } = this.props;
        return (
            <div className={classNames('simple-table__head__col', className)}>
                {(typeof children === 'function') ? children({ headIdx }) : children}
            </div>
        );
    }
}
