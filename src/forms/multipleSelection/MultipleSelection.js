import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import CustomPropTypes from '../../utils/CustomPropTypes';
import styleMaps from '../../styleMaps';
import LayoutHelper from '../LayoutHelper';
import MultipleSelectionMenu from './MultipleSelectionMenu';

class MultipleSelection extends Component {

    static propTypes = {
        className: PropTypes.string,
        displayKey: PropTypes.string,
        valueKey: PropTypes.string,
        selectableLabel: PropTypes.node, // left side
        selectedLabel: PropTypes.node, // right side
        selectedValues: PropTypes.array.isRequired,
        items: PropTypes.array.isRequired,
        disabled: PropTypes.bool,
        validator: PropTypes.func,
        onItemChanged: PropTypes.func,
        labelRenderer: PropTypes.func,

        // group usage
        useGroup: PropTypes.bool,
        groupKey: PropTypes.string,
        groupLabelMaps: PropTypes.object,

        // LayoutHelper
        bsClass: CustomPropTypes.keyOf(styleMaps.CLASSES),
        standalone: PropTypes.bool,
        labelClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        wrapperClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        helpTextClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ])
    };

    static defaultProps = {
        displayKey: 'label',
        valueKey: 'value',
        groupKey: 'group',
        disabled: false,
        validator: ({ component, selectedValues }) => true,
        labelRenderer: ({ component, labelValue }) => labelValue,

        // LayoutHelper
        bsClass: 'multiple-selection',
        standalone: true,
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        helpTextClassName: 'has-error'
    };

    constructor(props) {
        super(props);

        this.state = {
            helpText: ''
        };

        this.handleItemSelect = ::this.handleItemSelect;
    }

    handleItemSelect({ event, itemContent, selectData }) {
        const { valueKey, groupKey, items, useGroup, onItemChanged, selectedValues } = this.props;
        const { isSelect, isGroup } = selectData;
        let selected;

        if (useGroup && isGroup) {
            const clickGroups = _.map(_.filter(items, { [groupKey]: selectData[valueKey] }), valueKey);
            selected = isSelect ?
                _.pullAll(selectedValues, clickGroups) :
                _.uniq([...selectedValues, ...clickGroups]);
        } else {
            selected = isSelect ?
                _.pull(selectedValues, selectData[valueKey]) :
                [...selectedValues, selectData[valueKey]];
        }

        onItemChanged({ selectedValues: selected });

        // validate types and then showing help text when invalid
        this.validate(selected);
    }

    getSelectedItems() {
        const { items, selectedValues, valueKey } = this.props;
        return _.filter(items, (item) => {
            return _.includes(selectedValues, item[valueKey]);
        });
    }

    resetValidation() {
        this.setState({ helpText: '' });
    }

    isValid() {
        return this.validate(this.props.selectedValues).isValid;
    }

    hasValidationMessage() {
        return !!this.state.helpText;
    }

    validate(selectedValues) {
        const result = this.props.validator({
            component: this,
            selectedValues
        });
        const isValid = result === true;
        const helpText = isValid ? '' : result;

        this.setState({ helpText });

        return {
            isValid,
            helpText
        };
    }

    getMenuItems() {
        const {
            valueKey,
            items,
            useGroup,
            groupKey,
            groupLabelMaps,
            selectedValues
        } = this.props;
        let selectableItems = [];
        let selectedItems = [];
        let selectableGroups = [];
        let selectedGroups = [];

        _.forEach(items, (item, index) => {
            if (_.includes(selectedValues, item[valueKey])) {
                if (useGroup && !_.includes(selectableGroups, item[groupKey])) {
                    const value = item[groupKey];
                    const label = groupLabelMaps ? groupLabelMaps[value] : value;

                    selectedItems.push({
                        value,
                        label,
                        isSelect: true,
                        isGroup: true
                    });
                    selectableGroups.push(item[groupKey]);
                }

                selectedItems.push({
                    ...item,
                    isSelect: true
                });
            } else {
                if (useGroup && !_.includes(selectedGroups, item[groupKey])) {
                    const value = item[groupKey];
                    const label = groupLabelMaps ? groupLabelMaps[value] : value;

                    selectableItems.push({
                        value,
                        label,
                        isSelect: false,
                        isGroup: true
                    });
                    selectedGroups.push(item[groupKey]);
                }

                selectableItems.push({
                    ...item,
                    isSelect: false
                });
            }
        });

        return {
            selectableItems,
            selectedItems
        };
    }

    renderLabel(labelValue) {
        return this.props.labelRenderer({
            component: this,
            labelValue
        });
    }

    renderMultipleSelectionMenu(menuItems, type) {
        const { disabled, displayKey, valueKey } = this.props;
        return (
            <MultipleSelectionMenu
                className={`menu-${type}`}
                disabled={disabled}
                displayKey={displayKey}
                menuItems={menuItems}
                valueKey={valueKey}
                onItemSelect={this.handleItemSelect}
            />
        );
    }

    renderMultipleSelection() {
        const {
            bsClass,
            className,
            disabled,
            selectableLabel,
            selectedLabel
        } = this.props;
        const { selectableItems, selectedItems } = this.getMenuItems();

        return (
            <div className={classNames(styleMaps.CLASSES[bsClass], className, { disabled })}>
                <div className='row'>
                    <div className='cell menu-label'>
                        {this.renderLabel(selectableLabel)}
                    </div>
                    <div className='cell'></div>
                    <div className='cell menu-label'>
                        {this.renderLabel(selectedLabel)}
                    </div>
                </div>
                <div className='row'>
                    <div className='cell'>
                        {this.renderMultipleSelectionMenu(selectableItems, 'selectable')}
                    </div>
                    <div className='cell menu-middle'></div>
                    <div className='cell'>
                        {this.renderMultipleSelectionMenu(selectedItems, 'selected')}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            bsClass,
            standalone,
            labelClassName,
            wrapperClassName,
            helpTextClassName
        } = this.props;

        return (
            <LayoutHelper
                bsClass={bsClass}
                standalone={standalone}
                labelClassName={labelClassName}
                wrapperClassName={wrapperClassName}
                helpTextClassName={helpTextClassName}
                FieldBase={this.renderMultipleSelection()}
                helpText={this.state.helpText}
            />
        );
    }
}

export default MultipleSelection;
