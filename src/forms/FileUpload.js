import PropTypes from 'prop-types';
import React from 'react';
import { Basic } from './Basic';
import classNames from 'classnames';
import _ from 'lodash';
import { escapeSpace } from '../utils/stringUtils';
import Button from '../button/Button';
import HelpText from './HelpText';
import Tooltip from '../tooltip/TmTooltip';
import LayoutHelper from './LayoutHelper';

class FileUpload extends Basic {

    static propTypes = {
        btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        helpTextClassName: PropTypes.string,
        accept: PropTypes.string,
        actionButtonLabel: PropTypes.string,
        validator: PropTypes.func,
        onChange: PropTypes.func,
        onFileChange: PropTypes.func,
        onActionButtonClick: PropTypes.func,
        onClear: PropTypes.func,
        maxFileNameWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        helpText: PropTypes.string,
        displayFileNamePlacement: PropTypes.oneOf(['left', 'right']),
        displayFileName: PropTypes.bool,
        displayClear: PropTypes.bool,
        tooltip: PropTypes.bool,
        displayFileSize: PropTypes.bool,
        displayHelpText: PropTypes.bool,
        displayActionButton: PropTypes.bool,
        disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        iconEl: PropTypes.element,
        isDataFromProps: PropTypes.bool, // handle fileName, fileSize by props
        fileName: PropTypes.string,
        fileSize: PropTypes.number, // Bytes
        fileNameRenderer: PropTypes.func,
        tooltipRenderer: PropTypes.func
    };

    static defaultProps = {
        labelAlign: 'left',
        standalone: true,
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        helpTextClassName: 'has-error',
        btnText: 'Select File...',
        actionButtonLabel: 'Upload',
        helpText: '',
        displayFileNamePlacement: 'right',
        maxFileNameWidth: '100%',
        displayFileName: true,
        displayFileSize: true,
        displayHelpText: true,
        displayActionButton: false,
        displayClear: true,
        tooltip: true,
        disabled: false,
        validator: (fileUpload, fileName, fileExt, fileSize) => true,
        fileNameRenderer: ({ name, ext, size, sizeDisplay }) => escapeSpace(name),
        tooltipRenderer: ({ name, ext, size, sizeDisplay, displayFileSize }) => (
            `${escapeSpace(name)}${displayFileSize ? ` (${sizeDisplay})` : ''}`
        )
    };

    constructor(props) {
        const { fileName, fileSize } = props;
        super(props);

        this.state = {
            fileObject: null,
            helpText: null
        };
        this.originalVal = ::this._initOriginalVal();
        this.resultHandler = ::this.resultHandler;
    }

    _initOriginalVal() {
        return '';
    }

    getValue() {
        return this.getInputCompo(true).value;
    }

    isValid() {
        const { name, ext, size } = this.getFileInfo();
        let result = this.props.validator(this, name, ext, size); // true, false, string

        return (typeof result === 'object' && _.isFunction(result.then)) ? result : result === true;
    }

    formatBtyes(bytes, k=1024) {
        if (bytes === 0) {
            return '0 Byte';
        } else {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const dm = [0, 0, 1, 2, 2, 2, 2, 2, 2];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm[i]))} ${sizes[i]}`;
        }
    }

    getFileInfo(fromProps) {
        const { fileName, fileSize } = this.props;
        const fileObject = fromProps ? { name: fileName, size: fileSize } : this.state.fileObject;
        let fileInfo = {
            name: null,
            ext: null,
            size: 0
        };

        if (fileObject) {
            const { name, size } = fileObject;
            fileInfo = {
                name,
                ext: name ? name.split('.').pop() : null,
                size
            };
        };

        return fileInfo;
    }

    getInputCompo(original) {
        return original ? this.refs.fileInput : { files: [this.state.fileObject] };
    }

    clear() {
        const { onClear } = this.props;

        this.getInputCompo(true).value = '';
        this.setState({
            fileObject: null,
            helpText: null
        }, () => {
            const { name, ext, size } = this.getFileInfo();
            onClear && onClear(this, name, ext, size);
        });
    }

    resultHandler(res) {
        const validInfo = {
            helpText: null
        };

        if (res !== true) {
            validInfo.helpText = typeof res === 'string' ? res : this.props.helpText;
            validInfo.result = false;
        } else {
            validInfo.result = true;
        }

        this.setState({
            helpText: validInfo.helpText
        });

        return validInfo;
    }

    validate() {
        const { name, ext, size } = this.getFileInfo();
        const result = this.props.validator(this, name, ext, size); //true, false, string, promise

        if (typeof result === 'object' && _.isFunction(result.then)) {
            return result.then(this.resultHandler);
        } else {
            return this.resultHandler(result);
        }
    }

    _onChange(e) {
        // support single file for now
        const fileObject = this.getInputCompo(true).files[0];
        // following the HIE's style portal, we only update state when selecting file, due to click cancel button from file dialog will clear file object by browser default behavior
        if (fileObject) {
            e.persist();
            this.setState({
                fileObject
            }, () => {
                const { onFileChange, onChange } = this.props;
                const { name, ext, size } = this.getFileInfo();

                this.validate();
                onFileChange && onFileChange(this, name, ext, size, e);
                onChange && onChange(e);
            });
        }
    }

    _onClick(e) {
        this.getInputCompo(true).click();
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

    _onClickActionButton() {
        const { onActionButtonClick } = this.props;
        onActionButtonClick && onActionButtonClick(this.getInputCompo(true));
    }

    renderFileSize(size) {
        return (
            <span className='size'>
                {`(${this.formatBtyes(size)})`}
            </span>
        );
    }

    renderClearIcon() {
        return (
            <span className='close' onClick={::this.clear} />
        );
    }

    renderFileName() {
        const {
            maxFileNameWidth,
            displayFileSize,
            displayClear,
            tooltip,
            tooltipRenderer,
            fileNameRenderer,
            isDataFromProps
        } = this.props;
        const { name, ext, size } = this.getFileInfo(isDataFromProps);
        const sizeDisplay = this.formatBtyes(size);
        const fileNameDisplay = fileNameRenderer({ name, ext, size, sizeDisplay });

        if (tooltip) {
            return (
                <span className='fileName'>
                    <span
                        ref={(el) => this._inputFileEl = el}
                        data-tip
                        className='name'
                        style={{ maxWidth: maxFileNameWidth }}
                    >
                        {fileNameDisplay}
                        {displayFileSize && this.renderFileSize(size)}
                    </span>
                    <Tooltip
                        tooltipValue={tooltipRenderer({ name, ext, size, sizeDisplay, displayFileSize })}
                        getTargetEl={() => this._inputFileEl}
                        mode='infotip' />
                    {displayClear && this.renderClearIcon()}
                </span>
            )
        } else {
            return (
                <span className='fileName'>
                    <span className='name' style={{ maxWidth: maxFileNameWidth }}>
                        {fileNameDisplay}
                        {displayFileSize && this.renderFileSize(size)}
                    </span>
                    {displayClear && this.renderClearIcon()}
                </span>
            )
        }
    }

    renderFileInput() {
        let {
            labelAlign,
            standalone,
            labelClassName,
            wrapperClassName,
            className,
            btnText,
            actionButtonLabel,
            validator,
            children,
            displayFileNamePlacement,
            displayFileName,
            displayFileSize,
            displayHelpText,
            helpTextClassName,
            maxFileNameWidth,
            onActionButtonClick,
            onClear,
            onFileChange,
            helpText,
            disabled,
            displayActionButton,
            bsStyle,
            faStyle,
            tooltip,
            displayClear,
            labelText,
            iconEl,
            isDataFromProps,
            fileName,
            fileSize,
            fileNameRenderer,
            tooltipRenderer,
            ...rest
        } = this.props;

        return (
            <Button
                {...rest}
                className='uploadBtn btn'
                bsStyle={bsStyle}
                faStyle={faStyle}
                iconEl={iconEl}
                disabled={disabled}
                onClick={::this._onClick}
            >
                {btnText}
            </Button>
        )
    }

    renderActionButton() {
        const {
            displayActionButton,
            actionButtonLabel,
            isDataFromProps
        } = this.props;
        const { name } = this.getFileInfo(isDataFromProps);

        return (displayActionButton && name &&
            <div className='btn btn-default' onClick={::this._onClickActionButton}>
                {actionButtonLabel}
            </div>
        );
    }

    renderFileUpload() {
        const {
            accept,
            children,
            className,
            displayFileNamePlacement,
            displayFileName,
            isDataFromProps
        } = this.props;
        const { name } = this.getFileInfo(isDataFromProps);

        return (
            <div key='fileUpload' className={classNames('fileUpload', className)}>
                <input
                    ref='fileInput'
                    accept={accept}
                    type='file'
                    tabIndex={-1}
                    onChange={::this._onChange} />
                {displayFileName && name && displayFileNamePlacement === 'left' &&
                    this.renderFileName()
                }
                {this.renderFileInput()}
                {this.renderActionButton()}
                {displayFileName && name && displayFileNamePlacement === 'right' &&
                    this.renderFileName()
                }
                {children}
            </div>
        );
    }

    render() {
        const layoutHelperProps = _.pick(this.props, [
            'displayHelpText',
            'labelClassName',
            'wrapperClassName',
            'helpTextClassName',
            'labelText',
            'standalone',
            'inline',
            'labelAlign'
        ]);

        return (
            <LayoutHelper
                {...layoutHelperProps}
                FieldBase={this.renderFileUpload()}
                helpText={this.state.helpText || this.props.helpText} />
        );
    }
}

export default FileUpload;
