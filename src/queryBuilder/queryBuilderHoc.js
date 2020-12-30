import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';

export const DEFAULTVALUEKEY = '_main';

const ruleColType =
    PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.array,
        PropTypes.object
    ]);

const queryBuilderHoc = (WrappedComponent) => (class extends Component {
    static propTypes = {
        addButton: PropTypes.shape({
            cmp: PropTypes.func,
            props: PropTypes.object
        }),
        conditionLabel: PropTypes.shape({
            and: PropTypes.shape({
                cmp: PropTypes.func,
                props: PropTypes.object
            }),
            or: PropTypes.shape({
                cmp: PropTypes.func,
                props: PropTypes.object
            })
        }),
        Chan: PropTypes.object,
        defaultRules: PropTypes.array,
        emptyAddButton: PropTypes.node,
        emptyText: PropTypes.string, 
        filters: PropTypes.object,
        onQueryFieldChange: PropTypes.func,
        onQueryOperatorChange: PropTypes.func,
        onQueryValueChange: PropTypes.func,
        onAddNewRuleClick: PropTypes.func,
        removeButton: PropTypes.shape({
            cmp: PropTypes.func,
            props: PropTypes.object
        }),
        rootRules: PropTypes.shape({
            condition: PropTypes.string.isRequired,
            rules: PropTypes.arrayOf(PropTypes.shape({
                field: ruleColType,
                operator: ruleColType,
                value: ruleColType,
                condition: PropTypes.string,
                rules: PropTypes.array,
            })).isRequired
        }),
        filterChildren: PropTypes.array
    }

    constructor() {
        super();
        this.filterChildren = [];
        this.filterChildrenRefs = [];
        this.prepareFilterChildren = ::this.prepareFilterChildren;
        this.getFilterChildren = this.getFilterChildren;
        this.getFilterChildrenRefs = ::this.getFilterChildrenRefs;
    }

    getFilterChildren() {
        return this.filterChildren;
    }

    getFilterChildrenRefs() {
        return this.filterChildrenRefs;
    }

    getConditionCmp({ cmp, props }) {
        const Component = cmp;
        return (<Component {...props} />);
    }

    getCmp({ key, componentProps, component, val, idx, parentIdx, onQueryChange }) {
        const {
            onChangeEventName,
            valuePropertyName,
            getQueryValue,
            ...rest
        } = componentProps;
        const Component = component;
        let extraProps = {};

        if (onChangeEventName) {
            const onChangeEventNameList = _.isArray(onChangeEventName) ? onChangeEventName : [onChangeEventName];
            _.forEach(onChangeEventNameList, (callback) => {
                extraProps[callback] = (param) => {
                    const value = (getQueryValue && getQueryValue[callback]) ? getQueryValue[callback](param) : param;
                    onQueryChange && onQueryChange(value, idx, parentIdx);
                };
            });
        } else {
            extraProps.onChange = (e) => {
                const value = e.target ? e.target.value : e;
                onQueryChange && onQueryChange(value, idx, parentIdx);
            };
        }

        extraProps[valuePropertyName || 'value'] = val;

        return Component && (
            <Component
                ref={(el) => {
                    this.filterChildrenRefs[idx][key] = el;
                }}
                {...rest}
                {...extraProps} />
        );
    }

    getFieldCmp(config, val, idx, parentIdx) {
        const { onQueryFieldChange } = this.props;
        return this.getCmp({
            key: 'field',
            componentProps: config.fieldCmpProps,
            component: config.fieldCmp,
            val,
            idx,
            parentIdx,
            onQueryChange: onQueryFieldChange
        });
    }

    getOperatorCmp(config, val, idx, parentIdx) {
        const { onQueryOperatorChange } = this.props;
        return this.getCmp({
            key: 'operator',
            componentProps: config.operatorProps,
            component: config.operatorCmp,
            val,
            idx,
            parentIdx,
            onQueryChange: onQueryOperatorChange
        });
    }

    getValueCmp(config, val, idx, parentIdx) {
        const { onQueryValueChange } = this.props;
        return this.getCmp({
            key: 'value',
            componentProps: config.valueProps,
            component: config.valueCmp,
            val,
            idx,
            parentIdx,
            onQueryChange: onQueryValueChange
        });
    }

    getButtonCmp(config, idx, parentIdx) {
        const Component = config.cmp;
        const {onClick, ...restButtonProps} = config.props;
        return (
            <Component
                {...restButtonProps}
                onClick={(params) => {
                    onClick(idx, { ...params, parentIdx });
                }} />
        );
    }
    
    getRuleComponents(rule, idx, parentIdx) {
        const {
            filters,
            removeButton,
        } = this.props;

        const pairedCmps = filters.paired[rule.field];
        this.filterChildrenRefs[idx] = {};

        const operatorCfg = pairedCmps.operatorCmps;
        const valueCfg = (pairedCmps.valueCmps.hasOwnProperty(rule.operator))
            ? pairedCmps.valueCmps[rule.operator]
            : pairedCmps.valueCmps[DEFAULTVALUEKEY];

        return {
            FieldComponent: this.getFieldCmp(filters, rule.field, idx, parentIdx),
            OperatorComponent: this.getOperatorCmp(operatorCfg, rule.operator, idx, parentIdx),
            ValueComponent: this.getValueCmp(valueCfg, rule.value, idx, parentIdx),
            RemoveButtonComponent: this.getButtonCmp(removeButton, idx, parentIdx),
        };
    }

    prepareFilterChildren(rootRules) {
        const { addButton, conditionLabel } = this.props;

        const filterChildrenBuilder = (parent, parentIdx) => {
            return parent.rules.reduce((filters, rule, idx) => {
                const components = {
                    AddButtonComponent: this.getButtonCmp(addButton, idx),
                    ConditionComponent: this.getConditionCmp(conditionLabel[parent.condition])
                };
                if (rule.hasOwnProperty('field')) {
                    filters.push({
                        ...components,
                        ...this.getRuleComponents(rule, idx, parentIdx)
                    });
                } else if (rule.hasOwnProperty('rules')) {
                    filters.push({
                        ...components,
                        children: filterChildrenBuilder(rule, idx)
                    });
                } else {
                    throw 'children must be a rule (with `field` property) or a group (with `rules` property)';
                }
                return filters;
            }, []);
        };

        return this.filterChildren = filterChildrenBuilder(rootRules);
    }

    render() {
        const { defaultRules, filterChildren: customFilterChildren, rootRules } = this.props;
        const filterChildren = customFilterChildren || this.prepareFilterChildren(rootRules || defaultRules);
        return (
            <WrappedComponent 
                filterChildren={filterChildren}
                {...this.props} 
            />
        );
    }
});

export default queryBuilderHoc;
