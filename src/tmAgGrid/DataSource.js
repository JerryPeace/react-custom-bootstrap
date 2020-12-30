import { gridDefaultSort } from './utils';

export default class DataSource {

    constructor(props) {
        this.allRowData = _.clone(props.data) || [];
        this.primarySortKey = props.primarySortKey;
        this.displayedData = [];
        this.customSortFunc = props.customSortFunc || ::this.defaultSort;
        this.customFilterFunc = props.customFilterFunc || ::this.defaultFilter;
        this.filterModel = props.filterModel;
        this.enableServerSideOperations = props.enableServerSideOperations || false;
        this.onLoading = props.onLoading;
        this.onFilteredResult = props.onFilteredResult;
        this.onSelectChanged = props.onSelectChanged;
        this.onSelectAllChanged = props.onSelectAllChanged;
        this.selection = props.selection;
        this.__Listeners = {
            selection: [],
            displayed: []
        };

        this.addSelectionChangedListener = this.addEventListener.bind(this, 'selection');
        this.addDisplayedChangedListener = this.addEventListener.bind(this, 'displayed');
        this.removeSelectionChangedListener = this.removeEventListener.bind(this, 'selection');
        this.removeDisplayedChangedListener = this.removeEventListener.bind(this, 'displayed');
    }

    addEventListener(type, fn) {
        this.__Listeners[type].push(fn);
    }

    removeEventListener(type, fn) {
        let arr = this.__Listeners[type];
        let idx = arr.indexOf(fn);
        idx > -1 && arr.splice(idx, 1);
    }

    fireEvent(type, data) {
        this.__Listeners[type].forEach((item) => {
            item(data);
        });
    }

    onSelectionDataChanged() {
        this.fireEvent('selection', this.selection);
    }

    defaultSort(allRowData, column, direction) {
        return gridDefaultSort(allRowData, column, direction, this.primarySortKey);
    }

    defaultFilter(data, filter) {
        return _.filter(data, (item) => {
            for (let key in filter) {
                if (!_.isEqual(item[key], filter[key])) {
                    return false;
                }
            }
            return true;
        });
    }

    getRowsFromClient(params) {
        let data = this.allRowData;
        if (!data) {
            params.successCallback(data);
            return;
        }
        if (this.filterModel && this.customFilterFunc) {
            data = this.customFilterFunc(data, this.filterModel);
        }

        if (this.onFilteredResult) {
            // event should always fired even if we don't call filter function
            this.onFilteredResult(data);
        }

        if (params.sortModel && params.sortModel.length > 0 && this.customSortFunc) {
            data = this.customSortFunc(data, params.sortModel[0].colId, params.sortModel[0].sort);
        }

        data = data.slice(params.startRow, params.endRow);

        params.successCallback(data);
        this.displayedData = data;
        this.fireEvent('displayed', this.displayedData);
        if (this.onLoading) {
            this.onLoading(false);
        }
    }

    getRowsFromServer(params) {
        setTimeout(() => {
            params.successCallback(this.allRowData);
            this.displayedData = this.allRowData;
            this.fireEvent('displayed', this.displayedData);
            if (this.onLoading) {
                this.onLoading(false);
            }
        });
    }

    getRows(params) {
        if (!this.enableServerSideOperations) {
            this.getRowsFromClient(params);
        } else {
            this.getRowsFromServer(params);
        }
    }

    dispose() {
        this.allRowData = null;
        this.customSortFunc = null;
        this.customFilterFunc = null;
        this.onFilteredResult = null;
        this.onLoading = null;
    }
}
