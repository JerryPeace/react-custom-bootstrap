import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Radio from './Radio';
import LayoutHelper from './LayoutHelper';

// There are two methods to handle 'checked' to radio in RadioGroup
// 1. use selectedValue
// 2. set value and cehcekd in each item in 'items'
class RadioGroup extends Component {

    static propTypes = {
        inline: PropTypes.bool,
        items: PropTypes.array,
        labelAlign: PropTypes.string,
        selectedValue: PropTypes.any,
        standalone: PropTypes.bool,
        onChange: PropTypes.func,
        wrapperClassName: PropTypes.string,
        labelText: PropTypes.node
    };

    static defaultProps = {
        bsClass: 'radio-group',
        items: [],
        inline: false,
        labelAlign: 'right',
        standalone: false
    };

    constructor(props) {
        super(props);
        this.radios = [];
    }

    isDirty() {
        for (let i = 0; i < this.radios.length; i++) {
            let childCom = this.radios[i];
            if (childCom.isDirty && childCom.isDirty()) {
                return true;
            }
        }
        return false;
    }

    cleanDirty() {
        this.radios.map((childEl) => {
            // let childCom = this.refs[childEl.ref];
            childEl.cleanDirty && childEl.cleanDirty();
        });
    }

    getValue() {
        let value;

        for (let i = 0; i < this.radios.length; i++) {
            let childCom = this.radios[i];
            let checked = childCom.getChecked();

            if (checked) {
                return childCom.getValue();
            }
        }
        return null;
    }

    renderInputGroup() {
        const {
            items,
            inline,
            onChange,
            selectedValue,
            ...restProps
        } = this.props;

        this.childrenEls = items.map((item, idx) => {
            return (
                <Radio
                    checked={selectedValue === item.value}
                    inline={inline}
                    key={idx}
                    onChange={onChange}
                    ref={n => this.radios[idx] = n}
                    standalone={true}
                    {...item}
                />
            );
        });

        return this.childrenEls;
    }

    render() {
        const wrapperClassName = this.props.wrapperClassName || classNames('col-xs-10', {
            'col-xs-offset-2': !this.props.labelText
        });

        return (
            <LayoutHelper
                {...this.props}
                FieldBase={this.renderInputGroup()}
                wrapperClassName={wrapperClassName} />
        );
    }
}

export default RadioGroup;
