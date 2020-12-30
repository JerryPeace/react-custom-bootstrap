import PropTypes from 'prop-types';
import React from 'react';
import bootstrapUtils from '../utils/bootstrapUtils';
import classNames from 'classnames';
import TextField from './TextField';

class InputGroup extends React.Component {

    static propTypes = {
        bsClass: PropTypes.string,
        bsSize: PropTypes.oneOf(['lg', 'sm']),
        leftFieldType: PropTypes.oneOf(['button-group', 'others']),
        leftField: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        rightFieldType: PropTypes.oneOf(['button-group', 'others']),
        rightField: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        inputFieldRenderer: PropTypes.func
    };

    static defaultProps = {
        bsClass: 'input-group'
    };

    getValue() {
        return this.refs.inputCompo.getValue();
    }

    addonWrapper(component) {
        return (<span className='input-group-addon'>
                    {component}
                </span>);
    }

    btnGroupWrapper(component) {
        return (<span className='input-group-btn'>
                    {component}
                </span>);
    }

    renderSideComponent(field, fieldType) {

        if(field && fieldType) {

            if(fieldType === 'button-group') {
                return (this.btnGroupWrapper(field));
            } else {
                return (this.addonWrapper(field));
            }

        } else {
            return null;
        }
    }

    renderInputField(props) {
        const inputFieldRenderer = this.props.inputFieldRenderer;
        if (inputFieldRenderer) {
            return inputFieldRenderer(this.props);
        } else {
            return <TextField ref={'inputCompo'} {...props}/>;
        }
    }

    render() {
        const {className, leftField, leftFieldType, rightField, rightFieldType, bsClass, ...props} = this.props;

        let bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div className={classNames(className, bsCls)}>
                {this.renderSideComponent(leftField, leftFieldType)}
                {this.renderInputField(props)}
                {this.renderSideComponent(rightField, rightFieldType)}
            </div>
        );
    }

}

export default InputGroup;
