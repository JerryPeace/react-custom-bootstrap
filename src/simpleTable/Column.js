import PropTypes from 'prop-types';
import React, { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';
import ColumnBody from './ColumnBody';

export default class Column extends Component {
    static propTypes = {
        className: PropTypes.string,
        rowData: PropTypes.object,
        fieldKey: PropTypes.string,
        rowIdx: PropTypes.number,
        colIdx: PropTypes.number,
    };

    static defaultProps = {
        className: '',
        rowData: {},
        fieldKey: '',
    };

    render() {
        const {
            rowData,
            children,
            fieldKey,
            rowIdx,
            colIdx,
            className
        } = this.props;

        if (children) {
            if (typeof children === 'function') {
                return (
                    <div className={classNames('simple-table__body__col', className)}>
                        {children({ rowData, rowIdx, colIdx })}
                    </div>
                );
            } else if (!children.length && children.type === ColumnBody) {
                return cloneElement(children, { rowData, rowIdx, colIdx, className });
            } else if (children.length > 0) {
                return (
                    Children.map(children, (child) => {
                        if (child && child.type === ColumnBody) {
                            return cloneElement(child, { rowData, rowIdx, colIdx, className });
                        } else {
                            return null;
                        }
                    })
                );
            }
        }


        return (
            <div className={classNames('simple-table__body__col', className)}>
                {rowData[fieldKey]}
            </div>
        );
    }
}
