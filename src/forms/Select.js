import PropTypes from 'prop-types';
import React from 'react';
import {Basic} from './Basic';
import Label from './Label';
import LayoutHelper from './LayoutHelper';

class Select extends Basic {
    static propTypes = {
        labelText: PropTypes.node,
        getValue: PropTypes.func,
        onChange: PropTypes.func,
        items: PropTypes.array
    };

    static defaultProps = {
        bsClass: 'select',
        labelAlign: 'left',
        items: [],
        standalone: true,
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10'
    };

    constructor(props) {
        super(props);
        this.originalVal = ::this._initOriginalVal();
    }

    _initOriginalVal() {
        let value = '';
        if (typeof this.props.value !== 'undefined') {
            value = this.props.value;
        } else if (this.props.defaultValue) {
            value = this.props.defaultValue;
        } else if (this.props.items && this.props.items.length){
            value = this.props.items[0].value
        }
        return value;
    }

    getValue() {
        return this._inputEl.value;
    }

    renderSelect() {
        let {
            items,
            labelText,
            bsClass,
            labelAlign,
            standalone,
            labelClassName,
            wrapperClassName,
            value,
            defaultValue,
            ...rest
        } = this.props;

        let firstValue = defaultValue;
        if (!value && !defaultValue) {
            firstValue = this.originalVal;
        }

        return (
            <select
                ref={(el) => this._inputEl = el}
                key={'select'}
                value={value}
                defaultValue={firstValue}
                {...rest} >
                {items.map(function(opt, idx) {
                    const {text, ...rest} = opt;
                    return <option key={idx} {...rest}>{opt.text}</option>;
                })}
            </select>
        );
    }

    render() {
        return (
            <LayoutHelper FieldBase={this.renderSelect()} {...this.props} />
        );
    }
}

export default Select;
