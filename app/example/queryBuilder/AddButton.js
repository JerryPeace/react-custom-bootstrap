import React, { PropTypes } from 'react';
import { Button } from '../../../src';

const AddButton = (props) => {
    const { onClick } = props;
    return (
        <div className='btn-group'>
            <Button
                bsStyle='plain'
                bsSize='sm'
                onClick={() => onClick({ condition: 'AND' })}
            >
                {'AND'}
            </Button>
            <Button
                bsStyle='plain'
                bsSize='sm'
                onClick={() => onClick({ condition: 'OR' })}
            >
                {'OR'}
            </Button>
        </div>
    );
};

export default AddButton;
