import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import addBootstrapMixin from '../utils/addBootstrapMixin';
import FormGroup from './FormGroup';
import FormControls from './FormControls';
import Checkbox from './Checkbox';
import LayoutHelper from './LayoutHelper';

class CheckboxGroup extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.string,
        inline: PropTypes.bool,
        labelAlign: PropTypes.string,
        items: PropTypes.array,
        standalone: PropTypes.bool,
        labelText: PropTypes.node,
        onChange: PropTypes.func,
        validator: PropTypes.func,
        helpTextClassName: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'checkbox-group',
        inline: false,
        standalone: false,
        helpTextClassName: 'has-error'
    };

    state = {
        helpText: null
    };

    isDirty() {
        let childrenEls = this.childrenEls;
        for (let i = 0; i < childrenEls.length; i++) {
            let childCom = this.refs[childrenEls[i].ref];
            if (childCom.isDirty && childCom.isDirty()) {
                return true;
            }
        }
        return false;
    }

    cleanDirty() {
        this.childrenEls.map((childEl) => {
            let childCom = this.refs[childEl.ref];
            childCom.cleanDirty && childCom.cleanDirty();
        });
    }

    getValue() {
        let values = [];

        this.childrenEls.map(function(childEl) {
            let childCom = this.refs[childEl.ref],
                checked = childCom.getChecked();
            if (checked) {
                values.push(childCom.getValue());
            }
        }.bind(this));

        return values;
    }

    isValid = () => {
        return this.validate().result;
    }

    validate = () => {
        const value = this.getValue();
        const result = this.props.validator ? this.props.validator(this, value) : true;
        const validInfo = {
            result: result === true,
            helpText: _.isString(result) ? result : null
        };
        this.setState({
            helpText: validInfo.helpText
        });
        return validInfo;
    }

    _onChange = (e) => {
        this.props.onChange && this.props.onChange(e);
        this.validate();
    }

    renderInputGroup() {
        const {items, ...props} = this.props;
        let childrenEls = items.map((item, i) => {
            return (
                <Checkbox
                    ref={'checkbox' + i}
                    key={i}
                    name={props.name}
                    labelText={item.labelText}
                    value={item.value}
                    inline={props.inline}
                    labelAlign={item.labelAlign}
                    checked={item.checked}
                    onChange={this._onChange}
                    standalone={true} />
            );
        });

        return this.childrenEls = childrenEls;

    }

    render() {
        const wrapperClassName = classNames('col-xs-10', {
            'col-xs-offset-2': !this.props.labelText
        });
        return (
            <LayoutHelper
                {...this.props}
                FieldBase={this.renderInputGroup()}
                helpText={this.state.helpText}
                wrapperClassName={wrapperClassName} />
        );
    }
}

export default CheckboxGroup;
