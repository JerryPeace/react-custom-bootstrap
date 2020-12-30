import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

export default class ColumnBody extends Component {
    static propTypes = {
        className: PropTypes.string,
        rowData: PropTypes.object,
        rowIdx: PropTypes.number,
        colIdx: PropTypes.number,
    };

    static defaultProps = {
        className: '',
        rowData: {},
    };

    render() {
        const { className, children, rowData, rowIdx, colIdx } = this.props;
        return (
            <div className={classNames('simple-table__body__col', className)}>
                {(typeof children === 'function') ?
                    children({ rowData, rowIdx, colIdx }) : children
                }
            </div>
        );
    }
}
