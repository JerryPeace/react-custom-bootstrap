import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import {Basic} from './Basic';
import Label from './Label';
import classNames from 'classnames';
import FormGroup from './FormGroup';
import FormControls from './FormControls';
import HelpText from './HelpText';
import LayoutHelper from './LayoutHelper';

class Textfield extends Basic {
    static propTypes = {
        labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        inputType: PropTypes.oneOf(['text', 'password', 'datetime', 'datetime-local', 'date', 'month', 'time', 'week', 'number', 'email', 'url', 'file']),
        disabled: PropTypes.bool,
        multiline: PropTypes.bool,
        standalone: PropTypes.bool,
        helpText: PropTypes.string,
        helpTextComponent: PropTypes.element,
        helpTextClassName: PropTypes.string,
        onChange: PropTypes.func,
        onValueChange: PropTypes.func,
        onInputChange: PropTypes.func,
        onValidate: PropTypes.func,
        validator: PropTypes.func,
        tooltipProps: PropTypes.object,
        delayValidateTime: PropTypes.number
    };

    static defaultProps = {
        inputType: 'text',
        disabled: false,
        multiline: false,
        bsClass: 'input',
        labelAlign: 'left',
        standalone: true,
        helpText: '',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        helpTextClassName: 'has-error',
        delayValidateTime: 500,
        validator:
            (textField, value) => {
                return true;
            }
    };

    constructor(props) {
        super(props);
        this.oldVal = null;
        this.changeTimeoutID = null;
        this.validate = ::this.validate;
        this.originalVal = ::this._initOriginalVal();
        this._onChange = ::this._onChange;
        this.resultHandler = ::this.resultHandler;
    }

    componentWillUnmount() {
        clearTimeout(this.changeTimeoutID);
    }

    state = {
        helpText: null
    };

    _initOriginalVal() {
        let value;
        if (typeof this.props.value !== 'undefined') {
            value = this.props.value;
        } else if (typeof this.props.defaultValue !== 'undefined') {
            value = this.props.defaultValue;
        } else {
            value = '';
        }

        return value;
    }

    resultHandler(res) {
        const { onValidate } = this.props;
        const validInfo = {
            helpText: null
        };
        const isValid = res === true;

        if (!isValid) {
            validInfo.helpText = typeof res === 'string' ? res : this.props.helpText;
            validInfo.result = false;
        } else {
            validInfo.result = true;
        }

        this.setState({
            helpText: validInfo.helpText
        }, () => {
            onValidate && onValidate(isValid, {
                helpText: validInfo.helpText
            });
        });


        return validInfo;
    };

    getValue() {
        return this._inputEl && this._inputEl.value;
    }

    isValid() {
        const value = this.getValue();
        const result = this.props.validator(this, value); //true, false, string, promise

        return (typeof result === 'object' && _.isFunction(result.then)) ? result : result === true;
    }

    validate() {
        const { validator } = this.props;
        const value = this.getValue();
        const result = validator(this, value); //true, false, string, promise

        if (typeof result === 'object' && _.isFunction(result.then)) {
            return result.then(this.resultHandler);
        } else {
            return this.resultHandler(result);
        }
    }

    markInvalidText(text) {
        this.setState({
            helpText: text
        });
    }

    clearInvalidText() {
        this.markInvalidText(null);
    }

    _onChange(e) {
        let newVal = this.getValue(),
            oldVal = this.oldVal;

        clearTimeout(this.changeTimeoutID);

        this.changeTimeoutID = setTimeout(this.validate, this.props.delayValidateTime);

        if (this.props.onValueChange) {
            console.warn('Deprecated function, please use onInputChange');
            this.props.onValueChange(this, newVal, oldVal, e);
        }

        if (this.props.onInputChange) {
            this.props.onInputChange(newVal, {
                oldValue: oldVal,
                e
            });
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }

        this.oldVal = newVal;
    }

    getInputElement() {
        return this._inputEl;
    }

    renderInput() {
        const {inputType, className, multiline, helpText, labelText, onValueChange, bsClass, labelAlign, standalone, labelClassName, wrapperClassName, helpTextClassName, validator, bsSize, bsStyle, onChange, onValidate, children, delayValidateTime, ...rest} = this.props;
        const Component = multiline ? 'textarea' : 'input';

        return (
            <Component
                {...rest}
                ref={(el) => this._inputEl = el}
                key={Component}
                type={inputType}
                className={classNames(className)}
                onChange={this._onChange} />
        );
    }

    render() {
        return (
            <LayoutHelper
                {...this.props}
                FieldBase={this.renderInput()}
                helpText={this.props.helpText || this.state.helpText}
                getInputEl={() => this._inputEl} />
        );
    }
}

export default Textfield;
