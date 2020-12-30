import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import classNames from 'classnames';
import aggridEvents from './aggridEvents';
import SelectBoxCellRenderer from './cellRenderers/SelectBoxCellRenderer';
import SelectBoxHeaderRenderer from './cellRenderers/SelectBoxHeaderRenderer';
import { reactHeaderClassRendererFactory, eventController } from './utils';
import elementResizeEvent, { unbind } from 'element-resize-event';

export default class NativeGrid extends Component {
    static propTypes = {
        className: PropTypes.string,
        // AgGrid
        columnDefs: PropTypes.array.isRequired,
        gridOptions: PropTypes.object,
        suppressMultiSort: PropTypes.bool,
        enableColResize: PropTypes.bool,
        enableServerSideSorting: PropTypes.bool,
        rowHeight: PropTypes.number,
        headerHeight: PropTypes.number,
        suppressDragLeaveHidesColumns: PropTypes.bool,
        suppressMovableColumns: PropTypes.bool,
        overlayNoRowsTemplate: PropTypes.string,
        singleClickEdit: PropTypes.bool,
        embedFullWidthRows: PropTypes.bool,

        // grid
        defaultGridHeight: PropTypes.number,
        minHeight: PropTypes.number,
        enableMaxGridHeight: PropTypes.bool,
        maxGridHeightRowCount: PropTypes.number,
        isServerSidePagination: PropTypes.bool,
        enableAutoSizeColumnOnResize: PropTypes.bool,
        enableCustomSelection: PropTypes.bool,
        customSelectField: PropTypes.string,

        // data
        id: PropTypes.string,
        dataSource: PropTypes.object.isRequired,
        keyField: PropTypes.string,
        selectModel: PropTypes.array,
        sortingModel: PropTypes.array,
        columnSizeModel: PropTypes.array,
        columnOrderModel: PropTypes.array,

        // helper
        rowDisableCalculate: PropTypes.func, // help to determine if a row is disabled
        getRowClass: PropTypes.func, // help to build row classes
        getRowHeight: PropTypes.func, // help to calculate single row height
        isFullWidthCell: PropTypes.func, // help to render full width row
        fullWidthCellRendererFramework: PropTypes.func,

        // callbacks/events
        onSortChange: PropTypes.func,
        onFilteredResult: PropTypes.func,
        onViewportChanged: PropTypes.func,
        onLoading: PropTypes.func,
        onRowClicked: PropTypes.func,
        onGridReady: PropTypes.func,
        onColumnResized: PropTypes.func,
        onColumnReorder: PropTypes.func,

        // pagiantion
        pageIndex: PropTypes.number,
        pageSize: PropTypes.number,

        // i18n
        i18n: PropTypes.object
    };

    static defaultProps = {
        allRowData: [],
        className: '',
        customSelectField: 'select_checkbox',
        defaultGridHeight: 110,
        disabledCheckAllBox: false,
        displayCheckAllBox: true,
        enableAutoSizeColumnOnResize: true,
        enableColResize: true,
        enableMaxGridHeight: false,
        enablePagination: true,
        gridOptions: {
            enableServerSideSorting: true,
            headerCellTemplate: [
                '<div class="ag-header-cell">',
                '   <div id="agResizeBar" class="ag-header-cell-resize"></div>',
                '   <span id="agMenu" class="ag-header-icon ag-header-cell-menu-button"></span>',
                '   <div id="agHeaderCellLabel" class="ag-header-cell-label">',
                '       <span id="agText" class="ag-header-cell-text"></span>',
                '       <span id="agSortAsc" class="tm-ag-icon tm-ag-sort-asc"></span>',
                '       <span id="agSortDesc" class="tm-ag-icon tm-ag-sort-desc"></span>',
                '       <span id="agNoSort" class="ag-header-icon ag-sort-none-icon"></span>',
                '       <span id="agFilter" class="fa fa-filter"></span>',
                '   </div>',
                '</div>'
            ].join(''),
            icons: {
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>'
            },
            overlayLoadingTemplate: '<div class="loader-circle-side"><div class="loader"></div></div>',
            overlayNoRowsTemplate: 'No data to display',
            suppressDragLeaveHidesColumns: true,
            layoutInterval: 33
        },
        singleClickEdit: true,
        suppressMultiSort: true,
        headerHeight: 36,
        isServerSidePagination: false,
        maxGridHeightRowCount: 10,
        minHeight: 300,
        pageIndex: 0,
        pageSize: 25,
        rowHeight: 36,
        suppressMovableColumns: false
    };

    constructor(props) {
        super(props);

        let columnOrderModel = _.map(props.columnDefs, def => (_.pick(def, ['field', 'width'])));

        this.state = {
            selectModel: this.props.selectModel || [],
            sortingModel: this.props.sortingModel || [],
            columnSizeModel: this.props.columnSizeModel || [],
            columnOrderModel: this.props.columnOrderModel || columnOrderModel
        };
        this.awaredResizing = false;
        this.bindHandlers();

        this.i18n = this.props.i18n;
        this.i18nChangedHandler = ::this.i18nChangedHandler;
        this.listeners = {
            columnReorder: []
        };
    }

    componentDidMount() {
        if (this.props.enableAutoSizeColumnOnResize) {
            eventController.add(`resize.${this.props.id}`, window, 'resize', this.bindResizeEvent);
            this.bindResizeEvent();
        }
        this.i18n && this.i18n.on('languageChanged', this.i18nChangedHandler);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {
            isServerSidePagination,
            pageIndex,
            pageSize,
            columnDefs,
            enableAutoSizeColumnOnResize,
            sortingModel
        } = this.props;

        // when i18n change, the grid header need to update anyway
        if (!_.isEqual(_.map(columnDefs, def => _.pick(def, ['field', 'headerName', 'headerTooltip'])),
                              _.map(nextProps.columnDefs, def => _.pick(def, ['field', 'headerName', 'headerTooltip'])))) {
            // We also need to update column order model if column change.
            const columnOrderModel = _.map(nextProps.columnDefs,
                                           def => (_.pick(def, ['field', 'width'])));

            this.gridApi.setColumnDefs(this.getColumnDefs(nextProps, columnOrderModel));
            enableAutoSizeColumnOnResize && this.resizeColumns();
            this.setState({ columnOrderModel });
        }

        if (isServerSidePagination) {
            // If all are handled by server, we don't need to refresh grid for loading data.
            return false;
        } else if (!_.isEqual(sortingModel, nextProps.sortingModel) && !_.isEqual(this.gridApi.getSortModel(), nextProps.sortingModel)) {
            // If sort model changed from props, update the sorting model
            this.gridApi.setSortModel(nextProps.sortingModel);
        }

        // case 1: page index changed only, which won't affect page size
        // case 2: page size changed, which might change page index, too
        if (!_.isEqual(pageIndex, nextProps.pageIndex) && _.isEqual(pageSize, nextProps.pageSize)) {
            this.refreshGrid(nextProps.pageIndex);
        } else if (!_.isEqual(pageSize, nextProps.pageSize)) {
            this.gridApi.paginationController.pageSize = nextProps.pageSize;
            this.refreshGrid(nextProps.pageIndex);
        }

        return false;
    }

    componentWillUnmount() {
        if (this.props.enableAutoSizeColumnOnResize) {
            eventController.remove(`resize.${this.props.id}`);
            if (this.elementResizeEventBound) {
                unbind(this.gridApi.gridPanel.eBodyViewport);
                this.elementResizeEventBound = false;
            }
        }
        this.i18n && i18n.off('languageChanged', this.i18nChangedHandler);
    }

    i18nChangedHandler(lang) {
        this.refreshGrid(this.gridApi.paginationController.currentPage);
        document.querySelector('.ag-overlay-no-rows-wrapper > div').innerHTML = 'No data to display';
    }

    bindHandlers() {
        this.handleGridBodyResized = () => {
            this.resizeColumns();
            this.handleColumnDragStarted();
            this.handleColumnDragStopped();
        };
        this.bindResizeEvent = ::this.bindResizeEvent;
        this.handleGridReady = ::this.handleGridReady;
        this.handleBeforeSortChanged = this.handleSortChanged.bind(this, 'before');
        this.handleSortChanged = ::this.handleSortChanged;
        this.handleAfterSortChanged = this.handleSortChanged.bind(this, 'after');
        this.handleColumnResized = ::this.handleColumnResized;
        this.handleColumnDragStarted = ::this.handleColumnDragStarted;
        this.handleColumnDragStopped = ::this.handleColumnDragStopped;
        this.getRowClass = ::this.getRowClass;
        this.handleViewportChanged = () => {
            this.props.onViewportChanged && this.props.onViewportChanged();
            if (this.firstSizeToFit) {
                this.firstSizeToFit = false;
                this.resizeColumns();
            }
        };
    }

    resizeColumns() {
        this.awaredResizing = true;
        this.gridApi.sizeColumnsToFit();
        _.delay(() => {
            this.awaredResizing = false;
        }, 66);
    }

    bindResizeEvent(skip) {
        if (this.elementResizeEventBound || !this.gridApi) {
            return;
        }
        // The ag-grid uses eBodyViewport to calculate column size, we need to listen the size
        // change on it.
        elementResizeEvent(this.gridApi.gridPanel.eBodyViewport,
                           this.handleGridBodyResized);
        this.elementResizeEventBound = true;
        if (!skip) {
            _.delay(() => {
                this.resizeColumns();
            }, 66);
        }
    }

    refreshGrid(pageIdx) {
        let paginationController = this.gridApi.paginationController;
        paginationController.currentPage = pageIdx ? pageIdx : 0;
        paginationController.loadPage();
        if (this.props.onLoading) {
            this.props.onLoading(true);
        }
    }

    addEventListener(type, fn) {
        if (!this.listeners[type]) {
            throw new Error('supported event found: ' + type);
        }
        this.listeners[type].push(fn);
    }

    removeEventListener(type, fn) {
        if (!this.listeners[type]) {
            throw new Error('supported event found: ' + type);
        }

        const arr = this.listeners[type];
        const idx = arr.indexOf(fn);
        idx > -1 && arr.splice(idx, 1);
    }

    getColumnDefs(nextProps, newColumnOrderModel) {
        const {
            className,
            columnDefs,
            selectType,
            selectionColWidth,
            enableCustomSelection,
            customSelectField,
            displayCheckAllBox
        } = (nextProps || this.props);
        const isSingleSelect = selectType === 'single';
        const selectModel = this.state.selectModel;
        const sortingModel = this.state.sortingModel;
        const columnSizeModel = this.state.columnSizeModel;
        const columnOrderModel = newColumnOrderModel || this.state.columnOrderModel;
        let newColumnDefs = [...columnDefs];

        _.each(newColumnDefs, def => {
            def.sortingOrder = ['asc', 'desc'];
            if (def.apiRequired && def.cellRendererFramework) {
                def.cellRendererFramework = aggridEvents(def.cellRendererFramework, this);
            }
        });

        // set sort setting into columnDefs
        _.forEach(sortingModel, (sortItem) => {
            let findIndex = _.findIndex(columnDefs, {field: sortItem.colId});
            if (findIndex !== -1 && newColumnDefs[findIndex]) {
                newColumnDefs[findIndex].sort = sortItem.sort;
                newColumnDefs[findIndex].sortedAt = Number(new Date().valueOf());
            }
        });

        // set checkbox into columnDefs
        if (enableCustomSelection) {
            let selectField = {
                gridCls: className,
                headerName: '',
                field: customSelectField,
                width: selectionColWidth,
                suppressSizeToFit: true,
                suppressMovable: true,
                cellStyle: {
                    padding: '6px 8px'
                },
                cellClass: 'text-center tm-ag-selector',
                suppressSorting: true,
                headerCellTemplate: [
                    '<div class="ag-header-cell tm-ag-selector">',
                    '   <div id="agHeaderCellLabel" class="ag-header-cell-label tm-ag-checkbox">',
                    '       <span id="agText" class="ag-header-cell-text"></span>',
                    '   </div>',
                    '</div>'
                ].join(''),
                cellRendererFramework: SelectBoxCellRenderer
            };

            if (!isSingleSelect && displayCheckAllBox) {
                const renderer = reactHeaderClassRendererFactory(SelectBoxHeaderRenderer);
                selectField.headerCellRenderer = renderer;
            }

            newColumnDefs.unshift(selectField);
        }

        // set column width
        if (columnSizeModel.length > 0) {
            _.forEach(columnSizeModel, (_item, index) => {
                if (newColumnDefs[index]) {
                    newColumnDefs[index].width = _item.width;
                }
            });
        }

        // set column order
        if (columnOrderModel.length > 0) {
            const columnOrder = _.map(columnOrderModel, 'field');

            newColumnDefs.sort((a, b) => {
                return _.indexOf(columnOrder, a.field) - _.indexOf(columnOrder, b.field)
            });
            _.forEach(newColumnDefs, (_item, index) => {
                const
                    correspondModel = _.find(columnSizeModel, model => model.field === _item.field);

                if (correspondModel) {
                    newColumnDefs[index].width = correspondModel.width;
                }
            });
        }

        return newColumnDefs;
    }

    getRowClass(params) {
        // set selected row style
        const {
            keyField,
            getRowClass,
            rowDisableCalculate
        } = this.props;
        const selId = params.node.rowIndex;
        // If you want to remove `defaultRowCls`, please don't do that. We use this class name for
        // row selection implementation at SelectBoxCellRenderer. Please go there and check if you
        // may break the code.Ï
        let defaultRowCls = keyField ? `row_${keyField}_${selId}` : '';
        let disabledCls = rowDisableCalculate && rowDisableCalculate(params.data) ? 'row_disabled'
                                                                                  : '';
        let rowCls = getRowClass ? getRowClass(params) : '';

        return `${defaultRowCls} ${disabledCls} ${rowCls}`;
    }

    handleGridReady(params) {
        const {
            id,
            enableAutoSizeColumnOnResize
        } =  this.props;

        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        // There is a bug in ag-grid-react, url: https://github.com/ceolter/ag-grid-react/issues/59
        // The onColumnResized event is dispatched to the latest ag-grid if we have multiple ones.
        // This causes calculation wrong. The workaround is to hook columnResize event at api level.
        this.gridApi.addEventListener('columnResized', this.handleColumnResized);

        if (enableAutoSizeColumnOnResize) {
            // We need this flag to fit columns at the first rendering. Since the scroll will not
            // show at grid ready, we need to wait for viewportChanged event to fit columns.
            // Please note, we have client side and server side. In both version, grid ready will
            // before first viewportChanged event.
            this.firstSizeToFit = true;
            this.bindResizeEvent();
            _.delay(() => {
                this.resizeColumns();
            });
        }

        this.props.onGridReady && this.props.onGridReady(params);
    }

    handleSortChanged(type) {
        switch (type) {
        case 'before':
            // we need to override the default reset behavior to prevent pagination changed
            // while sorting, pagination in server.
            this.__OriginAgReset = this.gridApi.paginationController.reset;
            if (this.props.isServerSidePagination) {
                this.gridApi.paginationController.reset = () => {};
            } else {
                this.gridApi.paginationController.reset = () => {
                    this.gridApi.paginationController.loadPage();
                };
            }
            break;
        case 'after':
            this.gridApi.paginationController.reset = this.__OriginAgReset;
            break;
        default:
            if (this.props.onSortChange) {
                this.props.onSortChange(this.gridApi.getSortModel());
            }
        }
    }

    handleColumnResized() {
        const updatedColumnState = this.columnApi.getColumnState();
        const columnSizeModel = _.map(updatedColumnState, (_item) => ({
            field: _item.colId,
            width: _item.width
        }));

        if (this.props.enableAutoSizeColumnOnResize
            && this.elementResizeEventBound
            && !this.awaredResizing) {
            // We need to unbind the resize event if user tries to change the column size.
            unbind(this.gridApi.gridPanel.eBodyViewport);
            this.elementResizeEventBound = false;
        }

        this.setState({
            columnSizeModel
        });

        if (this.props.onColumnResized) {
            this.props.onColumnResized(columnSizeModel);
        }
    }

    handleColumnDragStarted() {
        if (this.props.enableAutoSizeColumnOnResize
            && this.elementResizeEventBound) {
            // We need to unbind the resize event if user tries to reorder the column and we should
            // bind it back after dragged.
            unbind(this.gridApi.gridPanel.eBodyViewport);
            this.elementResizeEventBound = false;
            // use hasResizeEventBeforeDragging flag to say we need to hook event back.
            this.hasResizeEventBeforeDragging = true;
        }
    }

    handleColumnDragStopped() {
        const {
            columnOrderModel: originalColumnOrderModel
        } = this.state;
        const {
            enableCustomSelection,
            onColumnReorder,
            customSelectField
        } = this.props;
        const curColumnState = this.columnApi.getAllDisplayedColumns();
        const curColumnOrderModel = _.map(curColumnState, (col) => ({
            field: col.colId,
            width: col.width
        }));
        const hasSelector = curColumnOrderModel[0].field === customSelectField;
        const isLeftPinnedColsStill = _.isEqual(
            _.map(_.filter(this.getColumnDefs(), 'pinned'), 'field'),
            _.map(this.columnApi.getDisplayedLeftColumns(), 'colId')
        );

        if (hasSelector || (!enableCustomSelection && isLeftPinnedColsStill)) {
            if (onColumnReorder) {
                onColumnReorder(curColumnOrderModel);
            }

            this.setState({ columnOrderModel: curColumnOrderModel });
        } else {
            this.gridApi.setColumnDefs(this.getColumnDefs(this.props,
                                                          originalColumnOrderModel));
        }
        if (this.props.enableAutoSizeColumnOnResize
            && this.hasResizeEventBeforeDragging) {
            // The resize event is hooked before dragging, we should hook it back.
            this.bindResizeEvent(true);
        }

        this.listeners.columnReorder.forEach((fn) => {
            try {
                fn();
            } catch (e) {}
        });
    }

    render() {
        const {
            headerHeight,
            rowHeight,
            getRowHeight,
            dataSource,
            pageSize,
            gridOptions,
            enableColResize,
            singleClickEdit,
            suppressMultiSort,
            suppressMovableColumns,
            overlayNoRowsTemplate,
            embedFullWidthRows,
            isFullWidthCell,
            fullWidthCellRendererFramework
        } = this.props;
        return (
            <div className='ag-tm-grid-wrapper'>
                <AgGridReact
                    gridOptions={{
                        datasource: dataSource,
                        ...gridOptions
                    }}
                    overlayNoRowsTemplate={overlayNoRowsTemplate}
                    datasource={dataSource}
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    rowModelType='pagination'
                    singleClickEdit={singleClickEdit}
                    suppressLoadingOverlay={true}
                    suppressMultiSort={suppressMultiSort}
                    suppressMovableColumns={suppressMovableColumns}
                    columnDefs={this.getColumnDefs()}
                    enableColResize={enableColResize}
                    paginationPageSize={pageSize}
                    enableSorting={false}
                    enableServerSideSorting={true}
                    onGridReady={this.handleGridReady}
                    onBeforeSortChanged={this.handleBeforeSortChanged}
                    onSortChanged={this.handleSortChanged}
                    onAfterSortChanged={this.handleAfterSortChanged}
                    // You know what, we use restProps to set other props to ag-grid which has
                    // an event handler for onColumnResized that is handled by ourself. If we don't
                    // set null to this one, it is called by ag-grid and us.
                    onColumnResized={null}
                    onDragStarted={this.handleColumnDragStarted}
                    onDragStopped={this.handleColumnDragStopped}
                    onRowClicked={this.props.onRowClicked}
                    getRowClass={this.getRowClass}
                    getRowHeight={this.props.getRowHeight}
                    onViewportChanged={this.handleViewportChanged}
                    // Render full width cell
                    embedFullWidthRows={embedFullWidthRows}
                    isFullWidthCell={isFullWidthCell}
                    fullWidthCellRendererFramework={fullWidthCellRendererFramework}
                    />
            </div>
        );
    }
}
