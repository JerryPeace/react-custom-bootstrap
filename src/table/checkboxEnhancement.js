import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// default commercial styles for paging toolbar
const toolbarStyle = {
    iconSize: 10,
    defaultIconProps: {
        style: {
            fill: '#999'
        },
        disabledStyle: {
            cursor: 'auto',
            fill: '#DFDCDC'
        },
        overStyle: {
            fill: 'gray'
        }
    },
    separatorFactory: function (sepProps) {
        sepProps.width = 1;
        sepProps.color = '#ddd';
    }
};

function dataTypesCheck(props, propName, componentName) {
    let value = props[propName],
        invalid = false,
        isArray = Array.isArray(value),
        isFunc = (typeof value === 'function'),
        isString = (typeof value === 'string'),
        message = '';

    if (!isFunc && !isString && !isArray) {
        invalid = true;
        message = 'Not any type of function, string, array.';
    }

    if (isArray && value.length !== 0) {
        value.forEach((item) => {
            if (typeof item !== 'object') {
                invalid = true;
                message = 'Is not object type of array shape.';
            } else if (props.useOriginalSelection && !item.hasOwnProperty(props.idProperty)) {
                invalid = true;
                message = 'Not having idProperty in array objects';
            }

            if (invalid) {
                return false;
            }
        })
    }

    if (invalid) {
        throw new Error(
            'Invalid prop `' + propName + '` supplied to' +
            ' `' + componentName + '`. Validation failed.' + ' ' + message
        )
    }
}

export default function checkboxEnhancement (Component) {
    const deprecatedWarning = () => {
        const msg = 'Warning: "Table" will be deprecated. Use "TmAgGrid" instead. [react-commercial-bootstrap]';
        console.group(msg);
        console.warn(msg);
        console.groupEnd();
        return msg;
    };
    class ColumnEnhancement extends React.Component {
        static propTypes = {
            checkbox: PropTypes.bool,
            disabledRowProperty: PropTypes.string,
            disableAllCheckbox: PropTypes.bool,
            singleSort: PropTypes.bool,
            disableRowCheckbox: PropTypes.func,
            multiSelect: PropTypes.bool,
            columns: PropTypes.array,
            columnResize: PropTypes.bool,
            columnOrderChange: PropTypes.bool,
            getDataSourceInfo: PropTypes.func,
            onSortChange: PropTypes.func,
            onSelectionChange: PropTypes.func,
            onSelectAllChange: PropTypes.func,
            paginationToolbarProps: PropTypes.object,
            defaultSelected: PropTypes.object,
            selected: PropTypes.object,
            selectedByIndex: PropTypes.array,
            defaultSelectedByIndex: PropTypes.array,
            headerPadding: PropTypes.string,
            rowHeight: PropTypes.number,
            sortInfo: PropTypes.array,
            defaultPage: PropTypes.number,
            useOriginalSelection: PropTypes.bool,
            idProperty: PropTypes.string,
            dataSource: dataTypesCheck,
            data: dataTypesCheck,
            className: PropTypes.string,
            onColumnResize: PropTypes.func,
            onColumnOrderChange: PropTypes.func,
            onPageSizeChange: PropTypes.func,
            onPageChange: PropTypes.func,
            page: PropTypes.number
        };

        static defaultProps = {
            idProperty: 'id',
            disabledRowProperty: 'disabled',
            headerPadding: '0px 12px',
            defaultPage: 1,
            rowHeight: 35,
            singleSort: false,
            checkbox: false,
            multiSelect: true,
            columnResize: false,
            sortable: false,
            columnOrderChange: false,
            withColumnMenu: false,
            disableAllCheckbox: false,
            disableRowCheckbox: (data, props) => {
                return false;
            }
        };

        constructor(props) {
            super(props);
            this.getValue = ::this.getValue;
            this.getAllData = ::this.getAllData;
            this.sortFn = ::this.sortFn;
            this.isRemote = ::this.isRemoteSource();

            this.state = {
                data: this.props.dataSource,
                columns: this.props.columns,
                selected: this.props.defaultSelected,
                page: this.props.defaultPage,
                selectAll: false
            }

            this._initCurrentSelectedByIndex();
        }

        componentDidMount() {
            if (!this.isRemote) {
                this.setSelectAll();
            }
        }

        /**
         * clear id in selectedIds when 'page change', 'sort change' and 'page size change'
         */
        componentWillReceiveProps(nextProps) {
            if (this.props.useOriginalSelection) {
                return;
            }

            const {
                defaultSelected
            } = this.props;

            const {
                selected: nextSelected,
                defaultSelected: nextDefaultSelected,
                dataSource: nextDataSource
            } = nextProps;

            if (!this.isRemote) {
                this.state.data = nextDataSource;
            }

            if (!nextSelected && !_.isEqual(defaultSelected, nextDefaultSelected)) {
                this.setState({
                    selected: nextDefaultSelected
                });
            }
        }

        componentDidUpdate(prevProps, prevState) {
            const preParameters = this.selectParameters(prevProps, prevState);
            const currParameters = this.selectParameters(this.props, this.state);

            if (!_.isEqual(preParameters, currParameters)) {
                if (this.props.useOriginalSelection) {
                    this._updateCurrentSelectedByIndex();
                }
                this.setSelectAll();
            }

            if (!_.isEqual(prevProps.columns, this.props.columns)) {
                /* eslint-disable react/no-did-update-set-state */
                this.setState({
                    columns: this.props.columns
                });
                /* eslint-enable react/no-did-update-set-state */
            }
        }

        selectParameters(props, state) {
            return [
                props.selected,
                state.selected,
                props.dataSource
            ];
        }

        clearSelectedRows() {
            this._currentSelectedByindex = [];
            this.setState({
                selected: []
            });
        }

        _updateCurrentSelectedByIndex() {
            const {dataSource, idProperty} = this.props;
            let newSelectedIndex = [];

            this._currentSelectedByindex.forEach((item) => {
                dataSource.forEach((newItem) => {
                    if (String(item) === String(newItem[idProperty])) {
                        newSelectedIndex.push(item);
                    }
                })
            });

            this._currentSelectedByindex = newSelectedIndex;
        }

        _initCurrentSelectedByIndex() {
            this._currentSelectedByindex = _.cloneDeep(this.props.defaultSelectedByIndex)
                                           || _.cloneDeep(this.props.selectedByIndex);
        }

        /**
         * Get selected items
         * @function getValue
         */
        getValue() {
            let data;
            if (this.props.useOriginalSelection) {
                data = this.props.dataSource;
            } else {
                data = this.state.data;
            }
            return _.filter(data, ::this.isSelectedRow);
        }

        /**
         * Get all items
         * @function getAll
         */
        getAllData() {
            return this.state.data;
        }

        /**
         * render checkbox for each row
         * @function renderRowCheckbox
         * @param {string} - checkbox value
         * @param {object} - row data
         * @param {object} - cell properties
         * @return {object} - valid react checkbox element
         */
        renderRowCheckbox(val, row, cellProps) {
            const {idProperty, disableRowCheckbox, disableAllCheckbox, disabledRowProperty} = this.props;
            let disabledRow;
            if (this.props.useOriginalSelection) {
                disabledRow = row[disabledRowProperty]
            } else {
                disabledRow = disableRowCheckbox(row, this.props);
            }


            return (
                <input
                    type={'checkbox'}
                    className={'rowSelector'}
                    value={row[idProperty]}
                    checked={this.isSelectedRow(row)}
                    readOnly
                    disabled={disableAllCheckbox || disabledRow} />);
        }

        /**
         * check if current row is already selected
         * @function isSelectedRow
         * @param {object} - selected row data
         */
        isSelectedRow(row) {
            const idProperty = this.props.idProperty;

            if (this.props.useOriginalSelection) {
                const SELECTED = this._currentSelectedByindex;

                return SELECTED.indexOf(row[idProperty]) !== -1 || SELECTED.indexOf(String(row[idProperty])) !== -1;
            } else {
                const selected = this.props.selected || this.state.selected;
                return _.has(selected, row[idProperty]);
            }
        }

        isRemoteSource() {
            const dataSource = this.props.dataSource || this.props.data;
            return _.isString(dataSource) || _.isFunction(dataSource);
        }

        dropDisabledRows(rows) {
            return _.filter(rows, (row) => {
                const isDisabled = this.props.disableRowCheckbox(row, this.props);
                return !isDisabled;
            });
        }

        _onSelectionChangeByIndex(newSelection, data) {
            const {onSelectionChange} = this.props;

            this.setState({
                selected: newSelection
            });

            onSelectionChange && onSelectionChange(newSelection, data);
        }

        /**
         * handle row item select
         * @function _onSelectionChange
         * @param {object} - selected row data
         */
        _onSelectionChange(newSelection, data) {
            // new selection model
            if (this.props.useOriginalSelection) {
                return this._onSelectionChangeByIndex(newSelection, data);
            }

            const {disableAllCheckbox, multiSelect, idProperty} = this.props;

            // Drop disabled rows
            const enabledRows = this.dropDisabledRows(newSelection);
            if (disableAllCheckbox || enabledRows.length === 0) {
                return void(0);
            }

            const preSelected = this.props.selected || this.state.selected;
            let newSelected = {};
            let nextSelected = {};

            if (multiSelect && enabledRows.length > 1) {
                // Select multi-items
                newSelected = _.keyBy(enabledRows, idProperty);
                nextSelected = _.assign({}, preSelected, newSelected);
            } else {
                // Select single item
                const row = _.last(enabledRows);
                newSelected[row[idProperty]] = row;

                if (this.isSelectedRow(row)) {
                    // Remove selection
                    nextSelected = _.omit(preSelected, row[idProperty]);
                } else {
                    // Add selection
                    if (multiSelect) {
                        nextSelected = _.assign({}, preSelected, newSelected);
                    } else {
                        nextSelected = newSelected;
                    }
                }
            }

            if (!this.props.selected) {
                this.setState({
                    selected: nextSelected
                });
            }

            // expose event to parent
            this.props.onSelectionChange && this.props.onSelectionChange({
                newSelection: newSelected,
                allData: this.state.data,
                nextSelected
            });
        }

        /**
         * handles select all checkbox change
         * @function onSelectAllChange
         * @return {object} - collection of selected objects
         */
        _onSelectAllChange() {
            const {disableAllCheckbox, idProperty, useOriginalSelection} = this.props;
            if (disableAllCheckbox) {
                return;
            }

            if (useOriginalSelection) {
                let newSelectAll = !this.state.selectAll;
                this._currentSelectedByindex = [];
                let SELECTED = {};
                if (newSelectAll) {
                    this.props.dataSource.forEach((item) => {
                        if (!item.disabled) {
                            let internalID = item[idProperty];
                            SELECTED[internalID] = {
                                [idProperty]: internalID
                            };
                        }
                    })
                }

                this.setState({
                    selected: SELECTED
                });
                return;
            }

            const isSelectAll = !this.state.selectAll;
            const enabledRows = this.dropDisabledRows(this.state.data);
            const newSelection = _.keyBy(enabledRows, idProperty);
            const preSelected = this.props.selected || this.state.selected;
            let nextSelected = {};

            if (isSelectAll) {
                nextSelected = _.assign({}, preSelected, newSelection);
            } else {
                nextSelected = _.omit(preSelected, _.keys(newSelection));
            }

            if (!this.props.selected) {
                this.setState({
                    selected: nextSelected
                });
            }

            // expose event to parent
            if (this.props.onSelectionChange) {
                this.props.onSelectionChange && this.props.onSelectionChange({
                    newSelection: newSelection,
                    allData: this.state.data,
                    nextSelected
                });
            }

            if (this.props.onSelectAllChange) {
                this.props.onSelectAllChange({
                    isSelectAll,
                    newSelection,
                    allData: this.state.data,
                    nextSelected
                });
            }
        }

        /**
         * set check all items state
         * @function setSelectAll
         */
        setSelectAll() {
            const {useOriginalSelection} = this.props;

            if (useOriginalSelection) {
                let currentDataSrc = this.props.dataSource,
                    realAllLength = currentDataSrc.length,
                    currentLength = this._currentSelectedByindex.length,
                    isAllSelected = false;

                currentDataSrc.forEach((value) => {
                    if (value.disabled) {
                        realAllLength--;
                    }
                });
                if (realAllLength === currentLength && currentLength !== 0) {
                    isAllSelected = true;
                }

                this.setState({
                    selectAll: isAllSelected
                });

            } else {
                const selected = this.dropDisabledRows(this.props.selected || this.state.selected);
                const data = this.dropDisabledRows(this.state.data);
                const isSelectAll = _.size(selected) === data.length && data.length !== 0;
                if (this.state.selectAll !== isSelectAll) {
                    this.setState({selectAll: isSelectAll});

                }
            }
        }

        /**
         * update column config to add checkboxes
         * @function appendChexkbox
         * @return {array} - column config settings
         */
        appendChexkbox(columns) {
            if (typeof columns !== 'object') {
                return columns;
            }

            // get copy of column config settings
            let columnConfig = columns.slice();
            let checkboxConfig = {
                name: 'checkbox',
                render: ::this.renderRowCheckbox,
                sortable: false,
                title:
                    <input
                        type={'checkbox'}
                        value={'all'}
                        className={'rowSelector'}
                        checked={this.state.selectAll ? 'checked' : ''}
                        disabled={this.props.disableAllCheckbox}
                        onChange={::this._onSelectAllChange}/>,
                textAlign: 'left',
                width: 45
            }

            if (!this.props.multiSelect) {
                checkboxConfig.title = ' ';
            }

            // insert checkbox config into first column
            columnConfig.unshift(checkboxConfig);
            return columnConfig;
        }


        _onColumnResize(firstCol, firstSize, secondCol, secondSize) {
            const columnsWithNewWidth = _.map(this.state.columns, (column) => {
                if (firstCol.name === column.name) {
                    let newColumn =  _.clone(column);
                    newColumn.width = firstSize;
                    return newColumn;
                } else {
                    return column;
                }
            });

            this.setState({columns: columnsWithNewWidth});
            this.props.onColumnResize && this.props.onColumnResize({
                firstCol,
                firstSize,
                secondCol,
                secondSize,
                columnsWithNewWidth
            });
        }

        sortFn(sortInfo, data) {
            const keys = [];
            const orders =[];

            _.forEachRight(sortInfo, (info) => {
                let key = info.name;
                if (info.fn) {
                    key = (data) => {
                        return info.fn(data[info.name], data, this.props);
                    };
                }
                keys.push(key);
                orders.push(info.dir);
            });

            return _.orderBy(data, keys, orders);
        }

        formatSort(sortInfo) {
            const dirMap = {
                '1': 'asc',
                '-1': 'desc'
            };
            if (sortInfo.length === 0) {
                let newSortInfo = _.clone(this.props.sortInfo);
                newSortInfo[0].dir = dirMap['1'];
                return newSortInfo;
            } else {
                const columns = _.keyBy(this.props.columns, 'name');
                const newSortInfo = _.map(sortInfo, (sortItem) => {
                    if (dirMap[sortItem.dir]) {
                        sortItem.dir = dirMap[sortItem.dir];
                    }
                    if (!sortItem.fn) {
                        sortItem.fn = columns[sortItem.name].sortBy
                    }
                    return sortItem;
                });

                if (this.props.singleSort) {
                    return [newSortInfo.pop()];
                } else {
                    return newSortInfo;
                }
            }
        }

        handleSortChange(sortInfo) {
            const newSortInfo = this.formatSort(sortInfo);
            if (this.isRemote) {
                // Remote data
                this.props.onSortChange && this.props.onSortChange(newSortInfo);
            } else {
                // Local data
                const sortedData = this.sortFn(newSortInfo, this.state.data);
                this.props.onSortChange && this.props.onSortChange({
                    sortInfo: newSortInfo,
                    sortedData,
                    sortFn: this.sortFn
                });
            }
        }

        handleColumnOrderChange(index, dropIndex) {
            if (this.props.checkbox === true){
                if (index && dropIndex) {
                    index--;
                    dropIndex--;
                } else {
                    return;
                }
            }

            let columnsWithNewOrder = _.clone(this.state.columns);
            const col = columnsWithNewOrder[index];
            columnsWithNewOrder.splice(index, 1); //delete from index, 1 item
            columnsWithNewOrder.splice(dropIndex, 0, col);

            this.setState({
                columns: columnsWithNewOrder
            });
            this.props.onColumnOrderChange && this.props.onColumnOrderChange({
                index,
                dropIndex,
                columnsWithNewOrder
            });
        }

        getPaginationToolbarProps() {
            return _.merge({}, toolbarStyle, this.props.paginationToolbarProps);
        }

        /**
         * handle number of records per page change
         * @param {string} - number of records per page
         */
        _onPageSizeChange(pageSize) {
            this._onPageChange(this.props.defaultPage);
            this.props.onPageSizeChange && this.props.onPageSizeChange(pageSize);
        }

        /**
         * handle page change
         * @param {string} - current page number
         */
        _onPageChange(page) {
            let pageSettings = {};
            if (!this.props.page) {
                this.setState({page});
            }
            this.props.onPageChange && this.props.onPageChange(page);
        }

        /**
         * sets internal data source to http response
         * @function _getDataSourceInfo
         * @param {array | object}  response data from http request
         */
        _getDataSourceInfo(res) {
            if (_.isString(this.props.dataSource)) {
                this.setState({
                    data: res,
                    selected: this.props.defaultSelected
                });
            } else {
                this.setState({
                    data: res.data,
                    selected: this.props.defaultSelected
                });
            }

            // expose event to parent
            this.props.getDataSourceInfo && this.props.getDataSourceInfo(res);
        }

        reload() {
            this.refs.reactDatagrid.reload();
        }

        getSelectedByIndex() {
            const {selectedByIndex, multiSelect, idProperty} = this.props;
            let SELECTED;

            let stateSelected;

            if (this.state.selected) {
                if (multiSelect === true) {
                    stateSelected = Object.keys(this.state.selected);
                } else {
                    stateSelected = [this.state.selected];
                }
            }

            let selectedIndex = selectedByIndex || stateSelected || this._currentSelectedByindex;

            if (multiSelect) {
                SELECTED = {};
                selectedIndex.forEach((item) => {
                    SELECTED[item] = {
                        [idProperty]: item
                    };
                });
            } else {
                SELECTED = selectedIndex[0];
            }

            this._currentSelectedByindex = selectedIndex;

            return SELECTED;
        }

        getSelected() {
            const {useOriginalSelection, selected, multiSelect} = this.props;
            let SELECTED;

            if (useOriginalSelection) {
                SELECTED = this.getSelectedByIndex();
            } else {
                SELECTED = selected || this.state.selected;
            }

            return SELECTED;
        }

        render() {
            const {
                dataSource,
                className,
                checkbox,
                multiSelect,
                columnResize,
                columnOrderChange,
                idProperty,
                selected,
                useOriginalSelection,
                defaultSelectedByIndex,
                selectedByIndex,
                ...props
            } = this.props;

            const columns = this.state.columns;
            const SELECTED = this.getSelected();
            deprecatedWarning();

            return (
                <div className={classNames('data-table', className)}>
                    <Component
                        ref={'reactDatagrid'}
                        {...props}
                        dataSource={dataSource}
                        idProperty={idProperty}
                        selected={SELECTED}
                        // selected={selected || this.state.selected}
                        page={this.props.page || this.state.page}
                        columns={checkbox ? ::this.appendChexkbox(columns) : columns}
                        paginationToolbarProps={::this.getPaginationToolbarProps()}
                        onColumnResize={columnResize ? ::this._onColumnResize : null}
                        onSelectionChange={checkbox ? ::this._onSelectionChange : null}
                        onColumnOrderChange={columnOrderChange ? ::this.handleColumnOrderChange : null}
                        getDataSourceInfo={::this._getDataSourceInfo}
                        onSortChange={::this.handleSortChange}
                        onPageChange={::this._onPageChange}
                        onPageSizeChange={::this._onPageSizeChange}
                        rowSelectByCheckbox={useOriginalSelection && checkbox}
                    />
                </div>)
        }
    }
    ColumnEnhancement.deprecatedWarning = deprecatedWarning;
    return ColumnEnhancement;
}
