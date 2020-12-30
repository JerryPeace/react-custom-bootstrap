import PropTypes from 'prop-types';
import React from 'react';
import { Basic } from './Basic';

class Fieldset extends Basic {
    static propTypes = {
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    };

    render() {
        const {
            children,
            className,
            title
        } = this.props;
        return (
            <fieldset className={className}>
                <legend>{title}</legend>
                <div className='fieldset-content'>{children}</div>
            </fieldset>
        );
    }
}

export default Fieldset;
