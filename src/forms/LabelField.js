import PropTypes from 'prop-types';
import React from 'react';
import {Basic} from './Basic';
import Label from './Label';
import FormGroup from './FormGroup';
import FormControls from './FormControls';
import classNames from 'classnames';
import LayoutHelper from './LayoutHelper';

class LabelField extends Basic {
    static propTypes = {
        labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        standalone: PropTypes.bool
    };

    static defaultProps = {
        labelAlign: 'left',
        standalone: true,
        bsClass: 'label-field',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10'
    };

    renderInput() {
        const {value, className} = this.props;

        return (
            <div className={className}>
                <span>
                    {(typeof value === 'string') ? value.replace(/  /gm, ' \u00a0') : value}
                </span>
            </div>
        );
    }

    render() {
        return (
            <LayoutHelper FieldBase={this.renderInput()} {...this.props} />
        );
    }
}

export default LabelField;
