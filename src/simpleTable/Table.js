import PropTypes from 'prop-types';
import React, { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';
import Mask from '../mask/Mask';
import Column from './Column';
import ColumnHead from './ColumnHead';
import ColumnBody from './ColumnBody';

export default class Table extends Component {
    static propTypes = {
        className: PropTypes.string,
        paddingType: PropTypes.oneOf(['reduced', 'extra']),
        data: PropTypes.array.isRequired,
        noDataPlaceholder: PropTypes.node,
    };

    static defaultProps = {
        className: '',
        paddingType: '',
        data: [],
    };

    static Column = Column;
    static ColumnBody = ColumnBody;
    static ColumnHead = ColumnHead;

    constructor(props) {
        super(props);
        this.ColNodes = Children.map(this.props.children, (child, idx) => {
            if (child.type === Column) {
                return cloneElement(child, { className: child.props.className });
            } else {
                return null;
            }
        });

        this.renderHead = :: this.renderHead;
        this.renderBody = :: this.renderBody;
    }

    renderHead() {
        return (
            <div className='simple-table__head'>
                {Children.map(this.ColNodes, (col, colIdx) => {
                    const { headText, children, className } = col.props;
                    if (children && !headText) {
                        return Children.map(children, (head, headIdx) => {
                            if (head.type === ColumnHead) {
                                return cloneElement(head, { headIdx, className });
                            } else {
                                return null;
                            }
                        });
                    } else {
                        return (
                            <div
                                className={classNames('simple-table__head__col', className)}
                                key={colIdx}
                            >
                                {headText}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }

    renderBody() {
        const { data, noDataPlaceholder, isLoading } = this.props;
        if (!(data instanceof Array)) {
            return null;
        }

        const noData = !data || !data.length;
        return (
            <div className='simple-table__body'>
                {data.map((rowData, rowIdx) => (
                    <div className='simple-table__body__row' key={rowIdx}>
                        {Children.map(this.ColNodes, (col, colIdx) => (
                            cloneElement(col, { rowData, rowIdx, colIdx })
                        ))}
                    </div>
                ))}
                {noData && (noDataPlaceholder || 'No data to display.')}
                {isLoading && <Mask isLoading={true} loaderProps={{ bsSize: 'lg' }} />}
            </div>
        );
    }

    render() {
        const { paddingType, className, data, isLoading } = this.props;
        const noData = !data || !data.length;

        return (
            <div className={classNames(
                'simple-table__container',
                className,
                { loading: isLoading }
            )}
            >
                <div
                    className={classNames(
                        'simple-table__content',
                        paddingType,
                        { 'no-data': noData }
                    )}
                >
                    {this.renderHead()}
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}


/**
== You can refer the following sample or check rdqa/flow_parser_of_na in DDD. ==

import { SimpleTable } from 'react-commercial-bootstrap';

<SimpleTable.Table
    className='shadow-proxy'
    data={data}
    paddingType='reduced'
    noDataPlaceholder={t('generic_msgs.no_data_to_display')}
>
    <SimpleTable.Column headText="Test1" fieldKey="col_1" />

    <SimpleTable.Column fieldKey="col_2">
        <SimpleTable.ColumnHead>
            {({ head, headIdx }) => (`Test2 ${headIdx}`)}
        </SimpleTable.ColumnHead>
    </SimpleTable.Column>

    <SimpleTable.Column>
        <SimpleTable.ColumnHead>
            <span style={{color: 'red'}}>{"Test3 and 4"}</span>
        </SimpleTable.ColumnHead>
        <SimpleTable.ColumnBody>
            {({ row, rowIdx, colIdx }) => (
                <span key={rowIdx}>{`${row.col_3} // ${row.col_4} | ${rowIdx} | ${colIdx}`}</span>
            )}
        </SimpleTable.ColumnBody>
    </SimpleTable.Column>

    <SimpleTable.Column headText="Test5">
        {({ row, rowIdx, colIdx }) => (
            <span key={rowIdx}>{`${row.col_2} + ${row.col_3}`}</span>
        )}
    </SimpleTable.Column>

    <SimpleTable.Column headText="Test6">
        <SimpleTable.ColumnBody>
            {({ row, rowIdx, colIdx }) => (
                <span key={rowIdx}>{`${row.col_1} + ${row.col_1}`}</span>
            )}
        </SimpleTable.ColumnBody>
    </SimpleTable.Column>
</SimpleTable.Table>

*/
