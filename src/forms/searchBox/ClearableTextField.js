import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import TmIcon from '../../icon/TmIcon';
import TextField from '../TextField';

class ClearableTextField extends React.Component {
    static propTypes = {
        inputType: PropTypes.string,
        value: PropTypes.string,
        onClear: PropTypes.func,
        defaultValue: PropTypes.string,
        onChange: PropTypes.func,

        // icon
        showLeftIcon: PropTypes.bool,
        leftIconName: PropTypes.string
    };

    static defaultProps = {
        inputType: 'text',
        showLeftIcon: false,
        leftIconName: 'search-o'
    };

    constructor(props) {
        super(props);
        this._onClear = ::this._onClear;
        this._onInputChange = ::this._onInputChange;
        this.setText = ::this.setText;

        const defaultValue = this.props.defaultValue;
        let displayClear = false;
        if (typeof defaultValue !== 'undefined' && defaultValue !== '') {
            displayClear = true
        }
        this.state = {displayClear};
    }

    componentDidMount() {
        this.getValue = ::this._textField.getValue;
        this.isValid = ::this._textField.isValid;
    }

    componentDidupdate(prevProps, prevState) {
        if (prevProps.value !== this.props.value) {
            this.updateClearBtn();
        }
    }

    _onInputChange(e) {
        const {
            value
        } = this.props;

        if (typeof value === 'undefined') {
            this.updateClearBtn();
        }

        this.props.onChange && this.props.onChange(e);
    }

    updateClearBtn() {
        const value = this.getValue();
        const displayClear =  !!value;
        if (this.state.displayClear !== displayClear) {
            this.setState({displayClear});
        }
    }

    setText(text) {
        this._textField._inputEl.value = text;
        this.updateClearBtn();
    }

    _onClear(e) {
        const {
            value,
            onClear
        } = this.props;

        if (typeof value === 'undefined') {
            this._textField._inputEl.value = '';
            this._textField._onChange(e);
        }
        onClear && onClear(e);
    }

    getInputElement() {
        return this._textField.getInputElement();
    }

    render() {
        const {
            onClear,
            onChange,
            showLeftIcon,
            leftIconName,
            ...textFieldProps
        } = this.props;
        const layoutHelperClassName = classNames({
            'has-left-icon': showLeftIcon
        });

        return (
            <div className='search-box-input'>
                <TextField
                    {...textFieldProps}
                    layoutHelperClassName={layoutHelperClassName}
                    ref={(el) => this._textField = el}
                    onChange={this._onInputChange}
                >
                    {showLeftIcon &&
                        <TmIcon
                            className='search-box-icon search-box-left-icon'
                            name={leftIconName} />
                    }
                    {this.state.displayClear &&
                        <TmIcon
                            className='search-box-icon search-box-close-icon'
                            name='close-s'
                            onClick={this._onClear} />
                    }
                </TextField>
            </div>
        );
    }
}

export default ClearableTextField;
