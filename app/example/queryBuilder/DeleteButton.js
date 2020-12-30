import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../../../src';

function DeleteButton({ onClick, className }) {
    return (
        <Button
            className={className}
            bsStyle='plain'
            bsSize='sm'
            onClick={() => onClick()}
        >
            {'X'}
        </Button>
    )
}

DeleteButton.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
}

export default DeleteButton

