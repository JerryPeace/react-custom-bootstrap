import PropTypes from 'prop-types';
import React from 'react';
import Button from './Button';

const LabeledButton = (props) => {
    const {
        btnLabel,
        buttonText,
        children,
        ...rest
    } = props;

    return (
        <Button {...rest} >
            <span className='btn-label'>
                {btnLabel}
            </span>
            {buttonText}
            {children}
        </Button>
    );
};

LabeledButton.propTypes = {
    btnLabel: PropTypes.node,
    buttonText: PropTypes.node
};

export default LabeledButton;
