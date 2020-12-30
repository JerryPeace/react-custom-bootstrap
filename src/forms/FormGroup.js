import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styleMaps from '../styleMaps';

function FormGroup(props) {
    const {
        className,
        standalone,
        children
    } = props;

    const cls = {
        [styleMaps.CLASSES['control-group']]: !standalone
    };

    return (
        <div className={classNames(cls, className)}>
            {children}
        </div>
    )
}

FormGroup.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    standalone: PropTypes.bool
};

FormGroup.defaultPorps = {
    standalone: false
};

export default FormGroup
