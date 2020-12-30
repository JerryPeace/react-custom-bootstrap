
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const renderTemplateLayout = (filter, params) => {
    const {
        ConditionComponent,
        FieldComponent, 
        OperatorComponent, 
        RemoveButtonComponent, 
        ValueComponent,
    } = filter;
    const {
        conditionClass,
        childIdx = 0,
        idx,
        rowWrapperClass
    } = params;
    return (
        <div className={classNames('form-group', rowWrapperClass)} key={`rule-row-${idx}-${childIdx}`}>
            <div className={classNames(
                'condition-column', {
                    'first-last-line-empty': childIdx === 0
                }, conditionClass
            )}>
                <div className={'condition-column-inner'}>
                    {childIdx !== 0 ? ConditionComponent : null}
                </div>
            </div>
            <div className='col-xs-5'>
                {FieldComponent}
            </div>
            <div className='col-xs-5'>
                {OperatorComponent}
            </div>
            <div className='col-xs-10'>
                {ValueComponent}
            </div>
            <div className='remove-column-wrapper'>
                <div className='remove-column'>
                    {RemoveButtonComponent}
                </div>
            </div>
        </div>
    );
};

const SmartFilterTemplate = (props) => {
    const {
        conditionClass, 
        emptyAddComponent,
        filterChildren,
        wrapperClass,
    } = props;

    return (
        <div className={classNames('smart-filter-template', wrapperClass)}>
            {filterChildren.map((filter, idx) => {
                return (
                    <div key={`rule-row-${idx}`}>
                        <div className='filter-group-style'>
                            {
                                filter.children 
                                ? filter.children.map((child, childIdx) => (
                                    renderTemplateLayout(child, { 
                                        ...props, 
                                        childIdx, 
                                        idx, 
                                    })
                                ))
                                : renderTemplateLayout(filter, { ...props, idx})
                            }
                            <div className='add-column last-line-display'>
                                {filter.AddButtonComponent}
                            </div>
                        </div>
                        {filterChildren.length === idx + 1 
                            ? null
                            : filter.ConditionComponent
                        }
                    </div>
                );
            })}
            <div>
                <div className={classNames(
                    'condition-column', 
                    'first-last-line-empty', 
                    conditionClass
                )}/>
                {emptyAddComponent}
            </div>
        </div>
    );
};

SmartFilterTemplate.propTypes = {
    conditionClass: PropTypes.string,
    emptyAddComponent: PropTypes.node,
    filterChildren: PropTypes.array.isRequired,
    rowWrapperClass: PropTypes.string,
    wrapperClass: PropTypes.string,
    condition: PropTypes.shape({
        Component: PropTypes.node.isRequired,
        value: PropTypes.string.isRequired
    }),
};

SmartFilterTemplate.defaultProps = {
    conditionClass: 'col-xs-1',
    filterChildren: [],
    rowWrapperClass: 'smart-filter-template-row',
    wrapperClass: 'form form-horizontal',
};

export default SmartFilterTemplate;
