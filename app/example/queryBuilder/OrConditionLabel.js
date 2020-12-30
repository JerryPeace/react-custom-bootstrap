import React, { PropTypes } from 'react';

const OrConditionLabel = props => {
    return (
        <div className='group-condition'>
            <span className='group-icon'>{props.children}</span>
        </div>
    );
};

export default OrConditionLabel;
