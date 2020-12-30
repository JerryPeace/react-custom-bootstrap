import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const DefaultTemplate = (props) => {
    const { 
        col1Class, 
        col2Class, 
        col3Class,
        conditionClass, 
        emptyAddComponent,
        filterChildren, 
        rowWrapperClass, 
        ruleControlClass,
        wrapperClass,
    } = props;

    return (
        <div className={wrapperClass}>
            {filterChildren.map((child, idx) => {
                const {
                    AddButtonComponent,
                    ConditionComponent,
                    FieldComponent, 
                    OperatorComponent, 
                    RemoveButtonComponent, 
                    ValueComponent,
                } = child;
                return (
                    <div className={rowWrapperClass} key={`rule-row-${idx}`}>
                        <div className={classNames(
                            'condition-column', {
                                'first-last-line-empty': idx === 0
                            }, conditionClass
                        )}>
                            <div className={'condition-column-inner'}>
                                {(idx !== 0) ? ConditionComponent : null}
                            </div>
                        </div>
                        <div className={col1Class}>
                            {FieldComponent}
                        </div>
                        <div className={col2Class}>
                            {OperatorComponent}
                        </div>
                        <div className={col3Class}>
                            {ValueComponent}
                        </div>
                        <div className={ruleControlClass}>
                            <div className='add-column'>
                                {AddButtonComponent}
                            </div>
                            <div className='remove-column'>
                                {RemoveButtonComponent}
                            </div>
                        </div>
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

DefaultTemplate.propTypes = {
    col1Class: PropTypes.string,
    col2Class: PropTypes.string,
    col3Class: PropTypes.string,
    conditionClass: PropTypes.string,
    emptyAddComponent: PropTypes.node,
    filterChildren: PropTypes.array.isRequired,
    rowWrapperClass: PropTypes.string,
    ruleControlClass: PropTypes.string,
    wrapperClass: PropTypes.string,
    condition: PropTypes.shape({
        Component: PropTypes.node.isRequired,
        value: PropTypes.string.isRequired
    }),
};

DefaultTemplate.defaultProps = {
    col1Class: 'col-xs-3',
    col2Class: 'col-xs-2',
    col3Class: 'col-xs-5',
    conditionClass: 'col-xs-1',
    filterChildren: [],
    rowWrapperClass: 'form-group',
    ruleControlClass: 'col-xs-1',
    wrapperClass: 'form form-horizontal',
};

export default DefaultTemplate;
