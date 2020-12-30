import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import {getGridHeight, eventController} from './utils';
import Pagination from './Pagination';
import DataSource from './DataSource';
import NativeGrid from './NativeGrid';
import { simpleTooltipCell, multilineTooltipCell } from './cellRenderers/SimpleTooltipCellRenderer';
import LinkCellRenderer from './cellRenderers/LinkCellRenderer';
import TextEditorRenderer from './cellRenderers/TextEditorRenderer';
import TextEditableCellRenderer from './cellRenderers/TextEditableCellRenderer';


class TmAgGrid extends Component {
    static propTypes = {
        className: PropTypes.string,
        noSelectCls: PropTypes.string,
        // ag-grid configure
        columnDefs: PropTypes.array.isRequired,
        gridOptions: PropTypes.object,
        suppressMultiSort: PropTypes.bool,
        enableColResize: PropTypes.bool,
        enableServerSideSorting: PropTypes.bool,
        onColumnResize: PropTypes.func,
        rowHeight: PropTypes.number,
        headerHeight: PropTypes.number,
        suppressDragLeaveHidesColumns: PropTypes.bool,
        style: PropTypes.object,

        // grid
        defaultGridHeight: PropTypes.number,
        minHeight: PropTypes.number,
        agGridStyle: PropTypes.object,
        enableMaxGridHeight: PropTypes.bool,
        maxGridHeightRowCount: PropTypes.number,
        isLoading: PropTypes.bool,
        isLoadingMask: PropTypes.bool,

        // data
        id: PropTypes.string,
        primarySortKey: PropTypes.string,
        allRowData: PropTypes.array,
        selectModel: PropTypes.array,
        sortingModel: PropTypes.array,
        filterModel: PropTypes.object,
        columnSizeModel: PropTypes.array,
        columnOrderModel: PropTypes.array,
        extendSession: PropTypes.func,

        // selection
        selectType: PropTypes.string, // single or multiple
        keyField: PropTypes.string,
        selectionColWidth: PropTypes.number,
        enableCustomSelection: PropTypes.bool,
        customSelectField: PropTypes.string,
        displayCheckAllBox: PropTypes.bool,
        disabledCheckAllBox: PropTypes.bool,
        onSelectChange: PropTypes.func,

        // sort
        customSortFn: PropTypes.func,
        onSortChange: PropTypes.func,

        // helper
        rowDisableCalculate: PropTypes.func, // help to determine if a row is disabled
        rowHiddenCalculate: PropTypes.func, // help to determine if a row is hidden
        getRowClass: PropTypes.func, // help to build row classes
        getGridHeightStyle: PropTypes.func, // help to calculate grid height
        getRowHeight: PropTypes.func, // help to calculate single row height
        pageSizeActiveValueRender: PropTypes.func, // help to render page size active value.

        // filter
        customFilterFunc: PropTypes.func,
        onFilteredResult: PropTypes.func,
        filteredCount: PropTypes.number,

        // pagination
        emptyDataNode: PropTypes.node, // display this node at pagination when no data.
        enablePagination: PropTypes.bool,
        pageSize: PropTypes.number,
        pageSizeItems: PropTypes.array,
        pageSizeDefault: PropTypes.number,
        onPageSizeChange: PropTypes.func,
        onPageIndexChange: PropTypes.func,
        pageIndex: PropTypes.number,
        pageIndexDefault: PropTypes.number,
        pageDisplayIndex: PropTypes.number,
        ifServerSidePagination: PropTypes.bool,
        minPageIndexNumber: PropTypes.number,
        maxPageIndexNumber: PropTypes.number,
        rowRangeInfoLabel: PropTypes.any, // unknown
        footerNode: PropTypes.node, // node displaying at footer which is also the pagination

        // auto size columns to fit
        enableAutoSizeColumnOnResize: PropTypes.bool,

        // events
        onLoading: PropTypes.func,

        // i18n
        i18n: PropTypes.object
    };

    static defaultProps = {
        className: '',
        noSelectCls: 'no-select',
        rowHeight: 36,
        headerHeight: 36,
        defaultGridHeight: 110,
        minHeight: 300,
        enableMaxGridHeight: false,
        maxGridHeightRowCount: 10,
        allRowData: [],
        selectType: 'multiple',
        selectionColWidth: 36,
        suppressMovableColumns: false,
        enableColResize: true,
        enableCustomSelection: true,
        customSelectField: 'select_checkbox',
        displayCheckAllBox: true,
        disabledCheckAllBox: false,
        enablePagination: true,
        pageIndexDefault: 0,
        pageSizeItems: [25, 50, 100, 150],
        pageSizeDefault: 25,
        minPageIndexNumber: 1,
        maxPageIndexNumber: 999999999999999,
        enableAutoSizeColumnOnResize: true
    };

    constructor(props) {
        super(props);

        const {
            pageIndex,
            pageIndexDefault,
            pageSizeDefault,
            enablePagination,
            ifServerSidePagination,

            allRowData,
            filteredCount,

            selectModel,
            filterModel,
            sortingModel,

            primarySortKey,
            customSortFn,
            customFilterFunc,

            columnSizeModel,
            columnOrderModel,
            columnDefs,
            onLoading
        } = this.props;

        this.state = {
            pageIndex: pageIndex || pageIndexDefault,
            pageSize: enablePagination ? pageSizeDefault : Math.pow(2, 32) - 1,
            filteredCount: filteredCount ? filteredCount : (allRowData ? allRowData.length : 0),
            selectModel: selectModel || [],
            sortingModel: sortingModel || [],
            columnSizeModel: columnSizeModel || [],
            columnOrderModel: columnOrderModel
                              || _.map(columnDefs, def => (_.pick(def, ['field', 'width'])))
        };

        this.localDataSource = new DataSource({
            data: allRowData,
            sortingModel: sortingModel,
            filterModel: filterModel,
            enableServerSideOperations: ifServerSidePagination,
            primarySortKey: primarySortKey,
            customSortFunc: customSortFn,
            customFilterFunc: customFilterFunc,
            onFilteredResult: ::this.handleFilteredResult,
            onLoading: onLoading,
            selection: {
                disabledCheckAllBox: this.props.disabledCheckAllBox,
                selectType: this.props.selectType, // single or multiple
                keyField: this.props.keyField,
                enableCustomSelection: this.props.enableCustomSelection,
                displayCheckAllBox: this.props.displayCheckAllBox,
                onSelectChange: this.props.onSelectChange,
                rowDisableCalculate: this.props.rowDisableCalculate,
                rowHiddenCalculate: this.props.rowHiddenCalculate,
                selectModel: this.state.selectModel
            },
            // Please note we don't need to set onSelectChanged callback because we handle selection
            // at handleRowClicked which is linked to onRowClicked of NativeGrid. The selectModel
            // will also propagate to SelectBoxCellRenderer through onSelectionDataChanged event.
            onSelectAllChanged: this.props.onSelectChange
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let refreshCheckList = ['allRowData'];

        if (!this.props.ifServerSidePagination) {
            refreshCheckList.push('filterModel');
        }

        refreshCheckList.forEach((item) => {
            if (!_.isEqual(this.props[item], nextProps[item])) {
                this.localDataSource[item] = nextProps[item];
                this.refreshGrid();
            }
        });

        let selectionDataChanged = false;
        let selectionCheckList = Object.keys(this.localDataSource.selection);
        selectionCheckList.forEach((item) => {
            if (!_.isEqual(this.localDataSource.selection[item], nextProps[item])) {
                this.localDataSource.selection[item] = nextProps[item];
                selectionDataChanged = true;
            }
        });
        selectionDataChanged && this.localDataSource.onSelectionDataChanged();

        return true;
    }

    componentWillUnmount() {
        eventController.remove(`resize.${this.props.id}`);
        this.localDataSource && this.localDataSource.dispose();
    }

    refreshGrid() {
        this.nativeGrid.refreshGrid();
    }

    getPageSettings() {
        return {
            pageSize: _.isNumber(this.props.pageSize) ? this.props.pageSize : this.state.pageSize,
            pageIndex: _.isNumber(this.props.pageIndex) ? this.props.pageIndex : this.state.pageIndex
        };
    }

    handleRowClicked(params) {
        const {
            enableCustomSelection,
            disabledCheckAllBox,
            selectType, // single or multiple
            keyField,
            onSelectChange,
            rowDisableCalculate,
            rowHiddenCalculate,
            noSelectCls
        } = this.props;

        if (_.includes(params.event.target.className, noSelectCls)) {
            return;
        }

        if (enableCustomSelection && !disabledCheckAllBox) {
            const isSingleSelect = selectType === 'single';
            const selectModel = this.props.selectModel || this.state.selectModel;
            const selectItemData = params.data;
            const selectItemKey = selectItemData[keyField];
            const checked = _.includes(_.map(selectModel, keyField), selectItemKey);
            let newSelectModel = selectModel;

            if ((rowDisableCalculate && rowDisableCalculate(selectItemData)) ||
                (rowHiddenCalculate && rowHiddenCalculate(selectItemData))) {
                return;
            }

            if (isSingleSelect) {
                if (checked) {
                    return;
                } else {
                    newSelectModel = checked ? [] : [selectItemData];
                }
            } else {
                if (checked) {
                    newSelectModel = _.filter(selectModel, _item => _item[keyField] !== selectItemKey);
                } else {
                    newSelectModel = selectModel.concat(selectItemData);
                }
            }

            this.setState({
                selectModel: newSelectModel
            });
            if (onSelectChange) {
                onSelectChange(newSelectModel);
            }
        }
    }

    handleFilteredResult(result) {
        // Please note that we don't need to populate filtered result if it is handled by server.
        if (this.props.ifServerSidePagination) {
            return;
        }
        // We will load this state if it is client-side pagination. Otherwise, it's from props.
        this.setState({ filteredCount: result.length });

        if (this.props.onFilteredResult) {
            this.props.onFilteredResult(result);
        }
    }

    handlePagination(action, e) {
        const {
            allRowData,
            extendSession,
            onSelectChange,
            onPageIndexChange,
            onPageSizeChange,
            ifServerSidePagination,
            minPageIndexNumber,
            maxPageIndexNumber
        } = this.props;

        switch (action) {
        case 'indexChange':
            this.setState({
                pageIndex: e,
            });

            if (onPageIndexChange) {
                onPageIndexChange(e);
            }
            break;
        case 'sizeChange':
            const {
                pageIndex,
                pageSize
            } = this.getPageSettings();

            const newPageSize = e;
            const newPageIndex = Math.ceil((pageIndex * pageSize + 1) / newPageSize) - 1;

            this.setState({
                selectModel: [],
                pageIndex: newPageIndex,
                pageSize: newPageSize,
            });

            // When page size change, the page index might be changed, too
            if (ifServerSidePagination) {
                if (onPageSizeChange) {
                    onPageSizeChange({
                        newPageSize,
                        newPageIndex
                    });
                }
            } else {
                extendSession && extendSession();
                if (onPageSizeChange) {
                    onPageSizeChange(newPageSize);
                }
                if (onPageIndexChange) {
                    onPageIndexChange(newPageIndex);
                }
            }
            break;
        default:
        }
    }

    renderAgGrid() {
        return (
            <NativeGrid
                {...this.props}
                {...this.getPageSettings()}
                dataSource={this.localDataSource}
                rowModelType='pagination'
                getRowClass={this.props.getRowClass}
                isServerSidePagination={this.props.ifServerSidePagination}

                onSortChanged={this.props.onSortChange}
                onColumnResized={this.props.onColumnResize}
                onLoading={this.props.onLoading}
                onRowClicked={::this.handleRowClicked}

                ref={(grid) => {
                    this.nativeGrid = grid;
                }}
            />
        );
    }

    renderPagination() {
        const {
            emptyDataNode,
            ifServerSidePagination,
            isLoading,
            pageSizeItems,
            pageSizeActiveValueRender,
            rowRangeInfoLabel,
            footerNode
        } = this.props;

        const totalCount = this[ifServerSidePagination ? 'props' : 'state'].filteredCount;

        return (
            <Pagination
                {...this.getPageSettings()}
                ref={(node) => {
                    this.pagination = node;
                }}
                totalCount={totalCount}
                onPageSizeChange={this.handlePagination.bind(this, 'sizeChange')}
                onPageIndexChange={this.handlePagination.bind(this, 'indexChange')}
                disabledAll={totalCount === 0 || isLoading}
                pageSizeActiveValueRender={pageSizeActiveValueRender}
                emptyDataNode={emptyDataNode}
                rowRangeInfoLabel={rowRangeInfoLabel}
                pageSizeItems={pageSizeItems}
                footerNode={footerNode}
            />
        )
    }

    resetPaginationPageDisplayIndex() {
        this.pagination.resetPageDisplayIndexByPageIndex();
    }

    render() {
        const {
            className,
            style,
            enablePagination,
            enableCustomSelection,
            enableColResize,
            enableMaxGridHeight,
            maxGridHeightRowCount,
            defaultGridHeight,
            rowHeight,
            getRowHeight,
            getGridHeightStyle,
            isLoading,
            isLoadingMask,
            agGridStyle,
            allRowData,
            ifServerSidePagination
        } = this.props;

        let scrollYButterHeight = 15;
        if (!enableColResize) {
            scrollYButterHeight = 0;
        }

        let heightStyle = {};
        if (enableMaxGridHeight) {
            if (getGridHeightStyle) {
                heightStyle = getGridHeightStyle({
                    ...this.props,
                    ...this.getPageSettings(),
                    filteredCount: this[ifServerSidePagination ? 'props' : 'state'].filteredCount
                });
            } else {
                heightStyle.height = getGridHeight(allRowData, maxGridHeightRowCount, rowHeight, getRowHeight, scrollYButterHeight, defaultGridHeight);
            }
        }

        const agStyle = { ...style, ...agGridStyle, ...heightStyle };

        return (
            <div
                className={classNames('tm-ag-grid', 'grid-body', {
                    'deselectable': !enableCustomSelection,
                    'no-col-resize': !enableColResize,
                    'has-pagination': enablePagination,
                    'has-mask': isLoadingMask,
                    'tm-loading': isLoading
                }, className)}
                style={agStyle}
                >
                {this.renderAgGrid()}
                {enablePagination && this.renderPagination()}
            </div>
        );
    }
}

TmAgGrid.simpleTooltipCell = simpleTooltipCell;
TmAgGrid.multilineTooltipCell = multilineTooltipCell;
TmAgGrid.linkCell = LinkCellRenderer;
TmAgGrid.textEditor = TextEditorRenderer;
TmAgGrid.textEditableCell = TextEditableCellRenderer;

export default TmAgGrid
