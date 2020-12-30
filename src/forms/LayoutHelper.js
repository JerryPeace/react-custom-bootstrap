import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import FormGroup from './FormGroup';
import Label from './Label';
import classNames from 'classnames';
import HelpText from './HelpText';
import styleMaps from '../styleMaps';
import CustomPropTypes from '../utils/CustomPropTypes';
import bootstrapUtils from '../utils/bootstrapUtils';
import TmTooltip from '../tooltip/TmTooltip';

export default class LayoutHelper extends React.Component {
    static propTypes = {
        bsClass: CustomPropTypes.keyOf(styleMaps.CLASSES),
        bsSize: CustomPropTypes.keyOf(styleMaps.SIZES),
        bsStyle: PropTypes.oneOf(styleMaps.STYLES),
        displayHelpText: PropTypes.bool,
        groupClassName: PropTypes.string,
        helpText: PropTypes.string,
        helpTextClassName: PropTypes.string,
        layoutHelperClassName: PropTypes.string,
        labelClassName: PropTypes.string,
        inline: PropTypes.bool,
        labelAlign: PropTypes.oneOf(['left', 'right']),
        labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        standalone: PropTypes.bool,
        wrapperClassName: PropTypes.string, //deprecated, please use colWrapperClassName
        colWrapperClassName: PropTypes.string,
        radioCheckboxWrapperClassName: PropTypes.string,
        tooltipProps: PropTypes.object,
        getInputEl: PropTypes.func,
        singleCheckboxRadio: PropTypes.bool,
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        indeterminate: PropTypes.bool,
        helpTextBsStyle: PropTypes.string,
        helpTextComponent: PropTypes.node,
        value: PropTypes.any,
        FieldBase: PropTypes.node
    };

    static defaultProps = {
        singleCheckboxRadio: false
    };

    constructor(props) {
        super(props);
        this.wrapperType = styleMaps.CLASSES[props.bsClass];
    }

    renderFormGroup(...children) {
        const {
            groupClassName,
            layoutHelperClassName
        } = this.props;
        return (
            <FormGroup key={'form-group'} className={classNames(groupClassName, layoutHelperClassName)}>
                {children}
            </FormGroup>
        );
    }

    renderLabel(children, labelWrapperCls) {
        let {className, labelClassName, bsClass, bsStyle, bsSize, labelText, inline, labelAlign, standalone, checked: isChecked, disabled: isDisabled, indeterminate: isIndeterminate, singleCheckboxRadio, ...props} = this.props;

        const elementCls = classNames({
            'disabled': isDisabled,
            'checked': isChecked,
            'indeterminate': isIndeterminate
        });

        if (!labelText && !singleCheckboxRadio) {
            return null;
        } else if (React.isValidElement(labelText)) {
            labelText = React.cloneElement(labelText, {key: 'custom-label'});
        }

        //for input text related css settings
        if (!children && !standalone) {
            bsClass = null;
            bsStyle = null;
            bsSize = null;
            className = classNames(styleMaps.CLASSES['control-label']);
        } else {
            className = null;
        }

        return (
            <Label
                key={'label'}
                className={classNames(className, elementCls, labelWrapperCls, labelClassName)}
                text={labelText}
                inline={inline}
                labelAlign={labelAlign}
                {...props}
            >
                {children}
            </Label>
        );
    }

    renderHelpText() {
        const {bsStyle, displayHelpText, helpText, helpTextBsStyle, helpTextComponent, helpTextClassName, ...props} = this.props;

        if (displayHelpText === false) {
            return null;
        }

        if (helpTextComponent) {
            return <helpTextComponent />;
        } else if (helpText) {
            return (
                <HelpText key={'helpText'} text={helpText} />
            );
        } else {
            return null;
        }
    }

    renderTooltip() {
        const {tooltipProps, getInputEl} = this.props;

        if (tooltipProps) {
            const getTargetFunc = tooltipProps.getTargetEl || getInputEl;
            return (
                <TmTooltip
                    {...tooltipProps}
                    key={'tooltip'}
                    getTargetEl={getTargetFunc} />
            );
        } else {
            return null;
        }
    }

    renderRadioCheckboxWrapper(children, idx, inputWrapperClass) {
        let key = 'checkbox-radio';

        if (!isNaN(idx)) {
            key += '-' + idx;
        }

        return (
            <div key={key} className={classNames(styleMaps.CLASSES[this.wrapperType], this.props.radioCheckboxWrapperClassName, inputWrapperClass)}>
                {children}
            </div>
        );
    }

    renderColWrapper(base, ...children) {
        const {wrapperClassName, colWrapperClassName, helpTextClassName, helpText} = this.props;
        let hasHelpTextCls = {
            [helpTextClassName]: (helpText) ? true : false
        }

        return (
            <div key={'col-wrapper'}
                className={classNames(wrapperClassName, colWrapperClassName, hasHelpTextCls)}>
                {base}
                {children}
            </div>
        );
    }

    getFormCls() {
        if (this.wrapperType === 'label-field' && typeof this.props.value === 'string') {
            return 'form-control-static';
        } else if (this.wrapperType === 'input' || this.wrapperType === 'select') {
            return 'form-control';
        } else {
            return '';
        }
    }

    renderGroupWrapper(FieldBase) {
        let FieldBaseWithWrapper = FieldBase.map((Fieldset, idx) => {
            return this.renderRadioCheckboxWrapper(Fieldset, idx);
        });
        return FieldBaseWithWrapper;
    }

    renderInputWithWrapper() {
        const {FieldBase, className, standalone, tooltipProps, ...props} = this.props;

        switch (this.wrapperType) {
        case 'checkbox':
        case 'radio':
            return (
                this.renderFormGroup(
                    this.renderColWrapper(
                        this.renderRadioCheckboxWrapper(
                            this.renderLabel(FieldBase, classNames(styleMaps.CLASSES['checkbox-radio-label'], styleMaps.CLASSES[this.wrapperType] + '-wrapper'))
                        )
                    )
                )
            );
        case 'checkbox-group':
        case 'radio-group':
            return (
                this.renderFormGroup(
                    this.renderLabel(),
                    this.renderColWrapper(
                        this.renderGroupWrapper(FieldBase),
                        [
                            this.renderHelpText()
                        ]
                    )
                )
            );
        default: //text, password, ...etc
            let cls = this.getFormCls();

            const controlFieldBase = React.cloneElement(FieldBase, {className: classNames(FieldBase.props.className, cls)});
            return (
                this.renderFormGroup(
                    this.renderLabel(),
                    this.renderColWrapper(
                        controlFieldBase,
                        [
                            this.renderHelpText(),
                            this.renderTooltip()
                        ]
                    )
                )
            );
        }
    }

    renderInput() {
        const {FieldBase, className, helpText, helpTextClassName, layoutHelperClassName, standalone, children, ...props} = this.props;

        const inputWrapperClass = classNames({
            [helpTextClassName]: !!helpText,
            [layoutHelperClassName]: layoutHelperClassName && standalone
        });

        switch (this.wrapperType) {
        case 'checkbox':
        case 'radio':
            return (
                this.renderRadioCheckboxWrapper(
                    this.renderLabel(FieldBase, classNames(styleMaps.CLASSES['checkbox-radio-label'], styleMaps.CLASSES[this.wrapperType] + '-wrapper')),
                    undefined,
                    inputWrapperClass
                )
            );
        case 'radio-group':
        case 'checkbox-group':
            return (
                <div className={inputWrapperClass}>
                    {this.renderGroupWrapper(FieldBase)}
                    {this.renderHelpText()}
                </div>
            );
        case 'button':
            return FieldBase;
        default: //text, password, ...etc
            let cls = this.getFormCls();
            const controlFieldBase = React.cloneElement(FieldBase, {className: classNames(FieldBase.props.className, cls)})
            return (
                <div className={inputWrapperClass}>
                    {this.renderLabel()}
                    {controlFieldBase}
                    {children}
                    {this.renderHelpText()}
                    {this.renderTooltip()}
                </div>
            );
        }
    }

    render() {
        if (this.props.standalone) {
            return (this.renderInput());
        } else {
            return (this.renderInputWithWrapper());
        }
    }
}
