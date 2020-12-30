import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { Button, ColorLabel, QueryBuilder, TextField, DDDSmartFilterTemplate } from '../../../src';

import AddButton from './AddButton';
import DeleteButton from './DeleteButton'
import OrConditionLabel from './OrConditionLabel';

export default class SmartFilterQueryBuilderSample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rootRules: {
                condition: 'or',
                rules: [
                    {
                        field: 0,
                        operator: false,
                        value: 'test'
                    },
                    {
                        condition: 'and',
                        rules: [
                            {
                                field: 0,
                                operator: true,
                                value: 0
                            },
                            {
                                field: 0,
                                operator: true,
                                value: 0
                            },
                            {
                                field: 1,
                                operator: false,
                                value: 'test'
                            }
                        ]
                    },
                    {
                        field: 2,
                        operator: false,
                        value: 'test'
                    }
                ]
            }
        };
        this.defaultRule = {
            field: 0,
            operator: 1,
            value: 1
        };
        this.handleAddNewRule = ::this.handleAddNewRule;
        this.handleRemoveRule = ::this.handleRemoveRule;
    }

    handleAddNewRule(idx, { condition }) {
        const rules = [ ...this.state.rootRules.rules ];
        if (condition === 'OR') {
            rules.splice(idx + 1, 0, this.defaultRule);
        } else {
            if (rules[idx].rules) {
                rules[idx].rules.push(this.defaultRule);
            } else {
                rules[idx] = {
                    condition,
                    rules: [ rules[idx], this.defaultRule ]
                };
            }
        }
        this.setState({ rootRules: {
            ...this.state.rootRules,
            rules
        }});
    }

    handleRemoveRule(removedIdx, { parentIdx }) {
        const rules = [ ...this.state.rootRules.rules ];
        if (parentIdx) {
            rules[parentIdx].rules.splice(removedIdx, 1);
        } else {
            rules.splice(removedIdx, 1);
        }
        this.setState({ rootRules: {
            ...this.state.rootRules,
            rules
        }});
    }

    _queryChange(value, idx, parentIdx, cb) {
        let rules = [ ...this.state.rootRules.rules ];
        let targetRule; 
        if (typeof parentIdx !== 'undefined') {
            targetRule = rules[parentIdx].rules[idx];
        } else {
            targetRule = rules[idx];
        }

        this.setState({ rootRules: {
            ...this.state.rootRules,
            rules
        }});

        return cb(targetRule, value);
    }

    handleFieldChange(value, idx, parentIdx) {
        this._queryChange(value, idx, parentIdx, (targetRule, value) => {
            targetRule.field = value;
            targetRule.operator = '';
            targetRule.value = '';
        });
    }

    handleOperatorChange(value, idx, parentIdx) {
        this._queryChange(value, idx, parentIdx, (targetRule, value) => {
            targetRule.operator = value;
        });
    }

    handleValueChange(value, idx, parentIdx) {
        this._queryChange(value, idx, parentIdx, (targetRule, value) => {
            targetRule.value = value;
        });
    }

    render() {
        const isOnlyCondition = this.state.rootRules.rules.length === 1;

        return (
            <div className='smart-filters-query-builder-wrapper'>
                <QueryBuilder
                    ref={(qb) => this.qb = qb}
                    Template={DDDSmartFilterTemplate}
                    defaultRules={[{
                        field: 0,
                        operator: 1,
                        value: 1
                    }]}
                    conditionLabel={{
                        and: {
                            cmp: ColorLabel,
                            props: {
                                children: 'AND'
                            }
                        },
                        or: {
                            cmp: OrConditionLabel,
                            props: {
                                children: 'OR'
                            }
                        }
                    }}
                    removeButton={{
                        cmp: DeleteButton,
                        props: {
                            className: isOnlyCondition ? 'disappear-remove' : 'pb-icon pb-cancel',
                            onClick: this.handleRemoveRule
                        }
                    }}
                    addButton={{
                        cmp: AddButton,
                        props: {
                            onClick: this.handleAddNewRule
                        }
                    }}
                    rootRules={this.state.rootRules}
                    filters={{
                        fieldCmp: Select,
                        fieldCmpProps: {
                            className: 'check-style field-select',
                            backspaceRemoves: false,
                            openOnFocus: true,
                            clearable: false,
                            searchable: true,
                            matchProp: 'label',
                            options: [
                                {label: 'Detection Type', value: '0'},
                                {label: 'Detection Rule ID', value: '1'}
                            ]
                        },
                        paired: {
                            '0': {
                                operatorCmps: {
                                    operatorCmp: Select,
                                    operatorProps: {
                                        className: 'check-style operator-select',
                                        clearable: false,
                                        searchable: false,
                                        options: [
                                            {label: 'in', value: true},
                                            {label: 'not in', value: false}
                                        ]
                                    }
                                },
                                valueCmps: {
                                    '_main': {
                                        valueCmp: Select,
                                        valueProps: {
                                            className: 'check-style field-select',
                                            backspaceRemoves: false,
                                            openOnFocus: true,
                                            clearable: false,
                                            searchable: true,
                                            options: [
                                                {label: 'Malicious Conetent', value: '0'},
                                                {label: 'Grayware', value: '1'}
                                            ]
                                        }
                                    },
                                    'true': {
                                        valueCmp: Select,
                                        valueProps: {
                                            className: 'check-style field-select',
                                            backspaceRemoves: false,
                                            openOnFocus: true,
                                            clearable: false,
                                            searchable: true,
                                            options: [
                                                {label: 'test', value: '0'},
                                                {label: 'test2', value: '1'}
                                            ]
                                        }
                                    }
                                }
                            },
                            '1': {
                                operatorCmps: {
                                    operatorCmp: Select,
                                    operatorProps: {
                                        className: 'check-style operator-select',
                                        clearable: false,
                                        searchable: false,
                                        options: [
                                            {label: 'in', value: true},
                                            {label: 'not in', value: false}
                                        ]
                                    }
                                },
                                valueCmps: {
                                    '_main': {
                                        valueCmp: TextField,
                                        valueProps: {}
                                    }
                                }
                            },
                            '2': {
                                operatorCmps: {
                                    operatorCmp: Select,
                                    operatorProps: {
                                        className: 'check-style operator-select',
                                        clearable: false,
                                        searchable: false,
                                        options: [
                                            {label: 'in', value: true},
                                            {label: 'not in', value: false}
                                        ]
                                    }
                                },
                                valueCmps: {
                                    '_main': {
                                        valueCmp: TextField,
                                        valueProps: {}
                                    }
                                }
                            }
                        }
                    }}
                    onQueryFieldChange={(option, idx, parentIdx) => this.handleFieldChange(option.value, idx, parentIdx)}
                    onQueryOperatorChange={(option, idx, parentIdx) => this.handleOperatorChange(option.value, idx, parentIdx)}
                    onQueryValueChange={(option, idx, parentIdx) => this.handleValueChange(option.value, idx, parentIdx)}
                    onAddNewRuleClick={this.handleAddNewRule} 
                />
            </div>
        );
    }
}
