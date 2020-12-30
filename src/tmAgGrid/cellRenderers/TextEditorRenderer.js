import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Textfield from '../../forms/TextField';
import styleMaps from '../../styleMaps';
import validStateWrapper from '../../hocs/tmAgGrid/validStateWrapper';
import TooltipHelper from '../../tooltip/TooltipHelper';

class TextEditorRenderer extends Component {
    static propTypes = {
        api: PropTypes.object,
        column: PropTypes.object,
        rowIndex: PropTypes.number,
        helpTextRenderer: PropTypes.func,
        isCancelBeforeStart: PropTypes.func,
        onBlur: PropTypes.func,
        textFieldProps: PropTypes.object,
        tooltipProps: PropTypes.object,
        validator: PropTypes.func,
        value: PropTypes.any,
        onComplete: PropTypes.func,
        // Create new value base on inputValue
        newValueCreator: PropTypes.func,
        // stopEditing is original function of AgGrid
        stopEditing: PropTypes.func,
        // displayRenderer only use to get default text
        displayRenderer: PropTypes.func
    };

    static defaultProps = {
        displayRenderer: ({value}) => _.toString(value),
        onComplete: ({inputValue, newValue, newAllRowData}) => true,
        newValueCreator: ({inputValue, value}) => inputValue
    };

    constructor(props) {
        super(props);

        this.defaultText = this.props.displayRenderer(this.props);
        this.state = {
            inputValue: this.defaultText
        }
    }

    componentDidMount() {
        this._textField._inputEl.addEventListener('keydown', this.handleKeyEvents);
        this.focus();
    }

    componentWillUpdate() {
        this._textField._inputEl.removeEventListener('keydown', this.handleKeyEvents);
    }

    componentDidUpdate() {
        this._textField._inputEl.addEventListener('keydown', this.handleKeyEvents);
        this.focus();
    }

    componentWillUnmount() {
        this._textField._inputEl.removeEventListener('keydown', this.handleKeyEvents);
    }

    // Handle keyboard events like "Esc", "Enter", etc
    handleKeyEvents = (event) => {
        // Disable agGrid keyboard event
        event.stopPropagation();

        // Add custom keyboard event
        const KEY_ESC = 27;
        const KEY_ENTER = 13;
        const key = event.which || event.keyCode;

        switch (key) {
        case KEY_ESC:
            this.setInputValue(this.defaultText);
            this._stopEditing();
            break;
        case KEY_ENTER:
            this.setInputValue(this.getValue());
            if (this._validate() === true) {
                this._stopEditing();
            }
            break;
        default:
            break;
        }
    }

    _stopEditing = () => {
        // [AgGrid API: stopEditing] Stop editing mode by AgGrid
        this.props.stopEditing()
    }

    // [AgGrid API: getValue]
    getValue = () => {
        return this._textField._inputEl.value;
    }

    // [AgGrid API: isCancelBeforeStart]
    isCancelBeforeStart = () => {
        const isCancelBeforeStart = this.props.isCancelBeforeStart;
        return isCancelBeforeStart && isCancelBeforeStart(this.props);
    }

    // [AgGrid API: isCancelAfterEnd]
    isCancelAfterEnd = () => {
        this._handleComplete();
        return false;
    }

    createUpdatedData = (newValue) => {
        const allData = this.props.api.gridOptionsWrapper.gridOptions.datasource.allRowData;
        const columnField = this.props.column.colId;
        const rowIndex = this.props.rowIndex;

        let newAllData = _.cloneDeep(allData);
        newAllData[rowIndex][columnField] = newValue;
        return newAllData;
    }

    _handleComplete = (shouldBeValid = false) => {
        const inputValue = this.getValue();
        const newValue = this.formatValue(inputValue);

        this.props.onComplete({
            ...this.props,
            inputValue,
            newValue,
            newAllRowData: this.createUpdatedData(newValue)
        }) !== false;
    }

    _validate = () => {
        const {
            validator,
            ...restProps
        } = this.props;

        if (!validator) {
            return true;
        } else {
            return validator({
                ...this.props,
                inputValue: this.state.inputValue,
                value: this.formatValue(this.state.inputValue)
            });
        }
    }

    focus = () => {
        setTimeout(() => {
            if (this._textField) {
                const inputEl = this._textField._inputEl;
                inputEl.selectionStart = this.state.inputValue.length;
                inputEl.focus();
            }
        });
    }

    setInputValue = (text) => {
        this.setState({
            inputValue: text
        });
        this._textField._inputEl.value = text;
    }

    handleBlur = () => {
        const {
            onBlur
        } = this.props;

        onBlur && onBlur();

        this.setInputValue(this.getValue());
        this._stopEditing();
    }

    formatValue = (inputValue) => {
        return this.props.newValueCreator({
            inputValue,
            ...this.props
        });
    }

    getErrMsg = () => {
        const errMsg = this._validate();
        return _.isString(errMsg) && errMsg;
    }

    getTooltipValue = (props) => {
        const helpTextRenderer = this.props.helpTextRenderer;
        const helpText = helpTextRenderer && helpTextRenderer({
            ...props,
            inputValue: this.state.inputValue
        });

        return  helpText || this.getErrMsg();
    }

    addTooltip = (textFieldEl, tooltipValue) => {
        const tooltipProps = {
            forceShow: true,
            mode: 'popover',
            placement: 'bottom-left',
            getTargetEl: () => ReactDOM.findDOMNode(this._textField),
            ...this.props.tooltipProps
        };
        return (
            <TooltipHelper tooltipValue={tooltipValue} {...tooltipProps} >
                {textFieldEl}
            </TooltipHelper>
        );
    }

    renderTextEditor = () => {
        const tooltipValue = this.getTooltipValue(this.props);
        const textFieldEl = (
            <Textfield
                ref={(el) => (this._textField = el)}
                layoutHelperClassName={`${styleMaps.CLASSES.tm}-text-editor`}
                standalone={true}
                defaultValue={this.state.inputValue}
                onBlur={this.handleBlur}
                {...this.props.textFieldProps}
            />
        );
        return tooltipValue ? this.addTooltip(textFieldEl, tooltipValue) : textFieldEl;
    }

    render() {
        const TextEditor = validStateWrapper(this.renderTextEditor);
        return (
            <TextEditor
                {...this.props}
                inputValue={this.state.inputValue}
                value={this.formatValue(this.state.inputValue)}
            />
        );
    }
}

export default TextEditorRenderer;
