import PropTypes from 'prop-types';
import React from 'react';
import {Basic} from './Basic';
import classNames from 'classnames';
import FormGroup from './FormGroup';
import FormControls from './FormControls';
import Label from './Label';
import LayoutHelper from './LayoutHelper';

class Radio extends Basic {

    static propTypes = {
        bsClass: PropTypes.string,
        checked: PropTypes.bool,
        className: PropTypes.string,
        defaultChecked: PropTypes.bool,
        inline: PropTypes.bool,
        inputType: PropTypes.oneOf(['radio']),
        labelAlign: PropTypes.string,
        labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        onChange: PropTypes.func,
        standalone: PropTypes.bool,
        value: PropTypes.any,
        wrapperClassName: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'radio',
        inline: false,
        inputType: 'radio',
        labelAlign: 'right',
        standalone: true,
        wrapperClassName: 'col-xs-offset-2 col-xs-10'
    };

    constructor(props) {
        super(props);
        this.originalVal = ::this._initOriginalVal();
    }

    state ={
        checked: this._initOriginalChecked()
    }

    _initOriginalVal() {
        const checked = this._initOriginalChecked();
        return checked ? (this.props.value || checked) : null;
    }

    _initOriginalChecked() {
        let checked;
        if (typeof this.props.checked !== 'undefined') {
            checked = this.props.checked;
        } else if (typeof this.props.defaultChecked !== 'undefined') {
            checked = this.props.defaultChecked;
        } else {
            checked = false;
        }

        return checked;
    }

    _onChange(e) {
        const {onChange, value} = this.props;
        if (typeof this.props.checked === 'undefined') {
            this.setState({
                checked: this.getChecked()
            });
        }
        onChange && onChange(e, value);
    }

    getValue() {
        const checked = this.getChecked();
        return checked ? (this._inputEl.getAttribute('value') || checked) : null;
    }

    getChecked() {
        return this._inputEl.checked;
    }

    renderInput() {
        const {className, inputType, labelText, inline, labelAlign, standalone, bsClass, wrapperClassName, ...rest} = this.props;

        return (
            <input
                ref={(el) => this._inputEl = el}
                {...rest}
                onChange={::this._onChange}
                type={inputType}
                key={'radio'} />
        );
    }

    render() {
        const checked = typeof this.props.checked !== 'undefined' ? this.props.checked : this.state.checked;
        return (
            <LayoutHelper
                FieldBase={this.renderInput()}
                {...this.props}
                checked={checked} />
        );
    }
}

export default Radio;
