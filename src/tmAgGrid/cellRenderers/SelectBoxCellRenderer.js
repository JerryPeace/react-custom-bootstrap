import PropTypes from 'prop-types';
import React, { Component } from 'react';

import IndeterminateCheckbox from '../IndeterminateCheckbox'

export default class SelectBoxCellRenderer extends Component {
    static propTypes = {
        api: PropTypes.object,
        data: PropTypes.object,
        node: PropTypes.object,
        colDef: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.dataSource = this.props.api.gridOptionsWrapper.gridOptions.datasource;

        let selection = this.dataSource.selection;
        let checked = _.includes(_.map(selection.selectModel, selection.keyField),
                                 this.props.data[selection.keyField]);

        this.state = { checked };

        this.handleCheckboxClicked = ::this.handleCheckboxClicked;
        this.handleSelectionChanged = ::this.handleSelectionChanged;
    }

    componentDidMount() {
        this.dataSource.addSelectionChangedListener(this.handleSelectionChanged);
        // update row selection class
        setTimeout(() => {
            this.selectRow(this.state.checked);
        });
    }

    componentWillUnmount() {
        this.dataSource.removeSelectionChangedListener(this.handleSelectionChanged);
    }

    handleCheckboxClicked() {
        if (this.dataSource.onSelectChanged) {
            this.dataSource.onSelectChanged(this.props.data);
        }
    }

    handleSelectionChanged(selection) {
        let checked = _.includes(_.map(selection.selectModel, selection.keyField),
                                 this.props.data[selection.keyField]);

        if (this.state.checked !== checked) {
            this.setState({ checked });
        }
    }

    selectRow(selected) {
        // Note: this is a hack to use 'ag-row-selected' class. We have to use it because multiple
        // selection only works at ag-grid checkbox but not row selection. In our case, we should
        // sync row selection and checkbox. Sadly, it cannot do that. So, we suppress their checkbox
        // and row selection, and we implement one by ourself.
        const selectedCls = 'ag-row-selected';
        let keyField = this.dataSource.selection.keyField;
        let selId = this.props.node.rowIndex;
        const gridCls = this.props.colDef.gridCls;
        const defaultRowCls = keyField ? `row_${keyField}_${selId}` : '';
        const currRowCls = gridCls ? `.${gridCls.trim().replace(' ', '.')} .${defaultRowCls}` : `.${defaultRowCls}`;

        // Toggle selected classname to row Elements
        const rowEls = defaultRowCls && document.querySelectorAll(currRowCls);
        for (let i = 0; rowEls && i < rowEls.length; i++) {
            rowEls[i].classList[selected ? 'add' : 'remove'](selectedCls);
        }
    }

    render() {
        const {
            disabledCheckAllBox,
            selectType,
            keyField,
            rowDisableCalculate,
            rowHiddenCalculate,
            selectModel
        } = this.dataSource.selection;
        const selectItemData = this.props.data;
        const isHiddenRow = rowHiddenCalculate && rowHiddenCalculate(selectItemData);
        const ifRowDisable = rowDisableCalculate && rowDisableCalculate(selectItemData);
        const inputType = selectType === 'single' ? 'radio' : 'checkbox';
        // update row selection class
        this.selectRow(this.state.checked);

        if (!isHiddenRow) {
            return (
                <div className={`${inputType} ${inputType}-info ${inputType}-inline`}>
                    <IndeterminateCheckbox
                        type={inputType}
                        checked={this.state.checked}
                        onChange={this.handleCheckboxClicked}
                        disabled={disabledCheckAllBox || ifRowDisable}
                    />
                    <label />
                </div>
            );
        } else {
            return null;
        }
    }
}

