import PropTypes from 'prop-types';
import React, { Component } from 'react';

import IndeterminateCheckbox from '../IndeterminateCheckbox'

export default class SelectBoxHeaderRenderer extends Component {
    static propTypes = {
        api: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.dataSource = this.props.api.gridOptionsWrapper.gridOptions.datasource;

        this.state = this.getCheckedState(this.dataSource.displayedData,
                                          this.dataSource.selection.selectModel);

        this.handleCheckboxClicked = ::this.handleCheckboxClicked;
        this.handleSelectionChanged = ::this.handleSelectionChanged;
        this.handleDisplayedChanged = ::this.handleDisplayedChanged;

        this.dataSource.addSelectionChangedListener(this.handleSelectionChanged);
        this.dataSource.addDisplayedChangedListener(this.handleDisplayedChanged);
    }

    getCheckedState(displayed, selectModel) {
        const { rowHiddenCalculate } = this.dataSource.selection;
        const displayedWithoutHidden = (rowHiddenCalculate) ? _.filter(displayed, i => !rowHiddenCalculate(i))
                                                            : displayed;
        return {
            checked: displayedWithoutHidden.length > 0 && selectModel.length === displayedWithoutHidden.length,
            semiChecked: selectModel.length > 0 && selectModel.length < displayedWithoutHidden.length,
            disabled: this.dataSource.selection.disabledCheckAllBox
        };
    }

    handleCheckboxClicked() {
        const { checked, semiChecked } = this.state;
        const { displayedData, selection, onSelectAllChanged } = this.dataSource;
        const { rowDisableCalculate, rowHiddenCalculate } = selection;

        if (onSelectAllChanged) {
            let totalSelection;

            totalSelection = rowDisableCalculate
                                   ? _.filter(displayedData, i => !rowDisableCalculate(i))
                                   : displayedData;

            totalSelection = rowHiddenCalculate
                                   ? _.filter(totalSelection, i => !rowHiddenCalculate(i))
                                   : totalSelection;

            onSelectAllChanged((checked || semiChecked) ? [] : totalSelection);
        }
    }

    handleSelectionChanged(selection) {
        let newState = this.getCheckedState(this.dataSource.displayedData, selection.selectModel);
        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    }

    handleDisplayedChanged(displayed) {
        let newState = this.getCheckedState(displayed, this.dataSource.selection.selectModel);
        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    }

    render() {
        return (
            <div className={'checkbox checkbox-info checkbox-inline'}>
                <IndeterminateCheckbox
                    type={'checkbox'}
                    checked={this.state.checked}
                    indeterminate={this.state.semiChecked}
                    onChange={this.handleCheckboxClicked}
                    disabled={this.state.disabled}
                />
                <label />
            </div>
        );
    }
}

