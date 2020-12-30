import PropTypes from 'prop-types';
import React, { Component } from 'react';

import queryBuilderHoc from './queryBuilderHoc';
import DefaultTemplate from './template/DefaultTemplate';

class QueryBuilder extends Component {
    static propTypes = {
        emptyAddButton: PropTypes.node,
        emptyText: PropTypes.string, 
        onAddNewRuleClick: PropTypes.func,
        Template: PropTypes.func,
        filterChildren: PropTypes.array,
    }

    static defaultProps = {
        emptyText: 'No specfic criteria.',
        Template: DefaultTemplate
    };

    renderTemplate(filterChildren) {
        const {
            emptyText,
            emptyAddButton,
            onAddNewRuleClick,
            Template, 
            ...restProps
        } = this.props;

        let emptyAddComponent;
        if (!filterChildren || filterChildren.length === 0) {
            emptyAddComponent = (
                <div className='col-xs-3'>
                    <span style={{ marginRight: '5px' }}>{emptyText}</span>
                    {/* add new rule button */ 
                        emptyAddButton && React.cloneElement(emptyAddButton, {
                            onClick: () => onAddNewRuleClick(-1)
                        })
                    }
                </div>
            );
        }
    
        return (
            <Template
                emptyAddComponent={emptyAddComponent}
                filterChildren={filterChildren}
                {...restProps}
            />
        );
    }

    render() {
        const { filterChildren } = this.props;
        return (
            <div className='query-builder'>
                {this.renderTemplate(filterChildren)}
            </div>
        );
    }
}

export default queryBuilderHoc(QueryBuilder);
