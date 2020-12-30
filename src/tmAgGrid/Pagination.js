import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames'
import Button from '../button/Button'
import FormGroup from '../forms/FormGroup'
import Label from '../forms/Label'
import ConvenientDropdown from '../dropdown/ConvenientDropdown'

export default class extends Component {

    static propTypes = {
        compClassNamePrefix: PropTypes.string,
        disabledAll: PropTypes.bool,
        disabledPageInput: PropTypes.bool,
        emptyDataNode: PropTypes.node,
        rowRangeInfoLabel: PropTypes.node,
        pageIndex: PropTypes.number,
        pageSize: PropTypes.number,
        pageSizeDropup: PropTypes.bool,
        totalCount: PropTypes.number,
        style: PropTypes.object,
        ifAllowPageDisplayIndexLargerThanTotalPage: PropTypes.bool,
        ifResetPageDisplayIndexOnBlur: PropTypes.bool,
        pageSizeItems: PropTypes.array,
        pageSizeActiveValueRender: PropTypes.func,
        minPageIndexNumber: PropTypes.number,
        maxPageIndexNumber: PropTypes.number,
        footerNode: PropTypes.node,

        onPageSizeChange: PropTypes.func,
        onPageIndexChange: PropTypes.func,
        onPageDisplayIndexChange: PropTypes.func,
        onPageDisplayIndexBlur: PropTypes.func
    };

    static defaultProps = {
        compClassNamePrefix: 'tm-ag',
        style: {},
        pageIndex: 0,
        pageSize: 25,
        pageSizeDropup: true,
        totalCount: 0,
        ifAllowPageDisplayIndexLargerThanTotalPage: true,
        ifResetPageDisplayIndexOnBlur: true,
        pageSizeItems: [25, 50, 100, 150],
        minPageIndexNumber: 1,
        maxPageIndexNumber: 999999999999999,
        emptyDataNode: 'No records to show',
        rowRangeInfoLabel: 'Records:',
        disabledAll: false,
        disabledPageInput: false,
        disabledPagePrev: false,
        disabledPageNext: false,
        pageSizeActiveValueRender: (pageSizeItem) => `${pageSizeItem.label} per page`
    };

    constructor(props) {
        super(props);

        this.state = {
            pageDisplayIndex: props.pageIndex + 1
        };

        this.handlePageSizeChanged = this.handleActions.bind(this, 'onPageSizeChanged');
        this.handlePageDisplayIndexCahnged = this.handleActions.bind(this,
                                                                     'onPageDisplayIndexChanged');
        this.handlePageIndexInputKeyDown = this.handleActions.bind(this, 'onPageIndexInputKeyDown');
        this.handlePageIndexInputBlur = this.handleActions.bind(this, 'onPageIndexInputBlur');
        this.handlePageGoPrev = this.handleActions.bind(this, 'prev');
        this.handlePageGoNext = this.handleActions.bind(this, 'next');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageIndex !== this.state.pageIndex) {
            this.setState({
                pageIndex: nextProps.pageIndex,
                pageDisplayIndex: nextProps.pageIndex + 1
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    handleActions(_action, _model) {
        const {pageDisplayIndex} = this.state;
        const {
            pageIndex,
            totalCount,
            pageSize,
            ifAllowPageDisplayIndexLargerThanTotalPage,
            ifResetPageDisplayIndexOnBlur,
            onPageSizeChange,
            onPageIndexChange,
            onPageDisplayIndexBlur,
            onPageDisplayIndexChange,
            minPageIndexNumber,
            maxPageIndexNumber
        } = this.props;
        const totalPages = Math.ceil(totalCount / pageSize);
        const max = ifAllowPageDisplayIndexLargerThanTotalPage ? maxPageIndexNumber : totalPages;
        let value;

        switch (_action) {
        case 'onPageSizeChanged':
            value = _model;
            const newPageIndex = Math.ceil((pageIndex * pageSize + 1) / value) - 1;

            this.setState({
                pageSize: value,
                pageIndex: newPageIndex,
                pageDisplayIndex: newPageIndex + 1
            });

            if (onPageSizeChange) {
                _.delay(() => {
                    onPageSizeChange(_model);
                }, 0);
            }

            break;
        case 'onPageDisplayIndexChanged':
            this.readFromState = true;
            value = _.clamp(parseInt(Number(_model.target.value), 10), minPageIndexNumber, max);

            this.setState({ pageDisplayIndex: value });
            if (onPageDisplayIndexChange) {
                _.delay(() => {
                    onPageDisplayIndexChange(value);
                }, 0);
            }

            break;
        case 'onPageIndexInputKeyDown':
            value = _model.target.value;

            const isPressEnter = _model.keyCode === 13;
            const isExceedingTotal = value > totalPages;
            const isInvalidInput = value < 1 || value === NaN;
            const isTheSamePageIndex = value === pageIndex + 1;

            if (isPressEnter) {
                this.readFromState = false;
                if (isExceedingTotal) {
                    this.setState({
                        pageIndex: totalPages - 1,
                        pageDisplayIndex: totalPages
                    });
                    if (onPageIndexChange) {
                        onPageIndexChange(totalPages - 1);
                    }

                } else if (isInvalidInput) {
                    this.setState({
                        pageDisplayIndex: pageIndex + 1
                    });
                    if (onPageDisplayIndexChange) {
                        onPageDisplayIndexChange(pageIndex + 1);
                    }

                } else if (!isTheSamePageIndex) {
                    this.setState({
                        pageIndex: value - 1,
                        pageDisplayIndex: value
                    });
                    if (onPageIndexChange) {
                        onPageIndexChange(value - 1);
                    }
                }
            }

            break;
        case 'onPageIndexInputBlur':
            this.readFromState = false;
            value = _model.target.value;
            if (ifResetPageDisplayIndexOnBlur) {
                this.resetPageDisplayIndexByPageIndex();
            }
            if (onPageDisplayIndexBlur) {
                onPageDisplayIndexBlur(value);
            }

            break;
        case 'prev':
            this.setState({
                pageIndex: pageIndex - 1,
                pageDisplayIndex: pageIndex
            });
            if (onPageIndexChange) {
                _.delay(() => {
                    onPageIndexChange(pageIndex - 1);
                }, 0);
            }

            break;
        case 'next':
            this.setState({
                pageIndex: pageIndex + 1,
                pageDisplayIndex: pageIndex + 2
            });
            if (onPageIndexChange) {
                _.delay(() => {
                    onPageIndexChange(pageIndex + 1);
                }, 0);
            }

            break;
        default:
        }
    }

    getRowRangeString() {
        const {
            pageIndex,
            pageSize,
            totalCount,
            emptyDataNode,
            rowRangeInfoLabel
        } = this.props;
        const totalPages = Math.ceil(totalCount / pageSize);
        const isLastPage = (pageIndex + 1) === totalPages;
        const pageStartRow = pageIndex * pageSize + 1;
        const pageEndRow = isLastPage ? totalCount : (pageIndex + 1) * pageSize;
        const rangeString = `${rowRangeInfoLabel} ${pageStartRow}-${pageEndRow} / ${totalCount}`;

        return totalCount === 0 ? emptyDataNode : rangeString;
    }

    resetPageDisplayIndexByPageIndex() {
        this.setState({
            pageDisplayIndex: this.props.pageIndex + 1
        });
    }

    render() {
        const {
            pageSize,
            pageIndex,
            compClassNamePrefix,
            className,
            style,
            totalCount,
            pageSizeDropup,
            pageSizeItems,
            disabledAll,
            disabledPageInput,
            pageSizeActiveValueRender,
            footerNode,
            onPageIndexChange,
            ...restProps
        } = this.props;


        const totalPages = Math.ceil(totalCount / pageSize);
        const isFirstPage = pageIndex === 0;
        const isLastPage = (pageIndex + 1) === totalPages;
        const isNoData = totalCount === 0;

        if (totalPages && pageIndex >= totalPages && onPageIndexChange) {
            _.delay(() => {
                onPageIndexChange(totalPages - 1);
            }, 0);
        }

        const pageDisplayIndex = this.readFromState ? this.state.pageDisplayIndex : pageIndex + 1;
        const baseDisplayIndexInputCount = 2;
        const pageDisplayIndexInputCount = pageDisplayIndex.toString().length;
        const exceedingCount = pageDisplayIndexInputCount - baseDisplayIndexInputCount;
        const exceedingWidth = exceedingCount > 0 ? exceedingCount * 8 : 0;
        const pageDisplayIndexInputWidth = 32 + exceedingWidth;

        const disabledPagePrev = isFirstPage || isNoData;
        const disabledPageNext = isLastPage || isNoData;

        return (
            <div
                className={classNames(`${compClassNamePrefix}-grid-pagination`, className)}
                style={style}
            >
                <div className='form-inline'>
                    {footerNode}
                    <FormGroup className='tm-ag-page-info'>
                        <Label
                            className={classNames('control-label', 'no-colon', 'row-range-summary')}
                            text={this.getRowRangeString()}
                        />
                    </FormGroup>

                    <span className='separator-line' />
                    <FormGroup className='tm-ag-page-sizer'>
                        <ConvenientDropdown
                            className={'page-size-selector'}
                            dropup={pageSizeDropup}
                            disabled={disabledAll}
                            activeValue={pageSize}
                            options={_.map(pageSizeItems, num => ({
                                label: num,
                                value: num
                            }))}
                            togglerBsStyle='link'
                            listWidth={100}
                            listPullRight={true}
                            onSelect={this.handlePageSizeChanged}
                            activeValueDisplayRender={pageSizeActiveValueRender}
                        />
                    </FormGroup>
                    <FormGroup className='page-summary'>
                        <input
                            style={{
                                width: pageDisplayIndexInputWidth
                            }}
                            type='number'
                            className={classNames('text-center', 'form-control', 'current-page')}
                            value={isNoData ? 0 : pageDisplayIndex}
                            disabled={disabledAll || disabledPageInput}
                            onChange={this.handlePageDisplayIndexCahnged}
                            onKeyDown={this.handlePageIndexInputKeyDown}
                            onBlur={this.handlePageIndexInputBlur}
                        />
                        <Label
                            classNames='control-label'
                            text={`/ ${totalPages}`}
                        />
                    </FormGroup>
                    <FormGroup className='tm-ag-page-flipper'>
                        <div className='btn-group'>
                            <Button
                                faStyle='angle-left'
                                className={'previous-page'}
                                bsStyle={'plain'}
                                onClick={this.handlePageGoPrev}
                                disabled={disabledAll || disabledPagePrev}
                            />
                            <Button
                                faStyle='angle-right'
                                className={'next-page'}
                                bsStyle={'plain'}
                                onClick={this.handlePageGoNext}
                                disabled={disabledAll || disabledPageNext}
                            />
                        </div>
                    </FormGroup>
                </div>
            </div>
        );
    }
}
