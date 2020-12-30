import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import focusHelper from '../utils/focusHelper';
import MediaObject from '../mediaObject';
import Button from '../button/Button';
import TmIcon from '../icon/TmIcon';
import styleMaps from '../styleMaps';
import Modal from './index';

const iconClsMap = {
    'error': styleMaps.CLASSES['modal-icon-error'],
    'warn': styleMaps.CLASSES['modal-icon-warn'],
    'success': styleMaps.CLASSES['modal-icon-success'],
    'info': styleMaps.CLASSES['modal-icon-info']
};

class ConfirmModalDialog extends Component {

    static propTypes = {
        bsSize: PropTypes.string,
        cancelButtonBSStyle: PropTypes.string,
        cancelButtonText: PropTypes.node,
        className: PropTypes.string,
        confirmButtonBSStyle: PropTypes.string,
        confirmButtonText: PropTypes.node,
        show: PropTypes.bool,
        showCancelButton: PropTypes.bool,
        showConfirmButton: PropTypes.bool,

        iconType: (props, propName, componentName) => {
            const validStringReg = /^(error|warn|success|info)$/;
            if (!props.icon && !validStringReg.test(props[propName])) {
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName}. You should use at least prop icon or iconType with value error, warn, success, info`
                  );
            }
        },

        header: PropTypes.node,
        icon: PropTypes.node,
        innerHeader: PropTypes.node,
        isLoading: PropTypes.bool,

        onCancelled: PropTypes.func,
        onConfirmed: PropTypes.func,

        useMediaObjectLayout: PropTypes.bool
    };

    static defaultProps = {
        bsSize: 'xs',
        confirmButtonBSStyle: 'info',
        icon: null,
        iconType: 'warn',
        showCancelButton: true,
        showConfirmButton: true,
        useMediaObjectLayout: true
    };

    constructor(props) {
        super(props);
        this.bindCancelButton = this.bindSelf.bind(this, 'cancelButton');
        this.bindConfirmButton = this.bindSelf.bind(this, 'confirmButton');
    }

    componentDidMount() {
        // We should focus the button when the dialog is shown.
        this.props.show && this.grabFocus();
    }

    componentDidUpdate(prevProps) {
        // We should focus the button when the dialog is shown.
        !prevProps.show && this.props.show && this.grabFocus();
    }

    grabFocus() {
        const { showCancelButton, showConfirmButton } = this.props;

        if (showConfirmButton && this.confirmButton) {
            ReactDOM.findDOMNode(this.confirmButton).focus();
        } else if (showCancelButton && this.cancelButton) {
            ReactDOM.findDOMNode(this.cancelButton).focus();
        } else {
            // We should also try to focus on close button, but we cannot get the reference of
            // it. So, just blur the activeElement.
            focusHelper.blurActive();
        }
    }

    bindSelf(name, elm) {
        this[name] = elm;
    }

    renderButtons() {
        const {
            cancelButtonBSStyle,
            cancelButtonText,
            confirmButtonBSStyle,
            confirmButtonText,
            isLoading,
            showCancelButton,
            showConfirmButton,
            onCancelled,
            onConfirmed
        } = this.props;

        return (
            <footer className='confirm-modal-dialog-buttons'>
                {showConfirmButton &&
                    <Button
                        bsStyle={confirmButtonBSStyle}
                        className='confirm-modal-dialog-confirm-button'
                        disabled={isLoading}
                        ref={this.bindConfirmButton}
                        onClick={onConfirmed}>
                        {confirmButtonText}
                    </Button>
                }
                {showCancelButton &&
                    <Button
                        bsStyle={cancelButtonBSStyle}
                        className='confirm-modal-dialog-cancel-button'
                        disabled={isLoading}
                        ref={this.bindCancelButton}
                        onClick={onCancelled}>
                        {cancelButtonText}
                    </Button>
                }
            </footer>
        );
    }

    renderIcon() {
        const { iconType, icon } = this.props;
        return icon || <div className={classNames('modal-icon', iconClsMap[iconType])} />;
    }

    renderContent() {
        const {
            iconType,
            children,
            innerHeader,
            useMediaObjectLayout
        } = this.props;

        if (useMediaObjectLayout) {
            return (
                <MediaObject image={this.renderIcon()} titleText={innerHeader}>
                    {children}
                </MediaObject>
            );
        } else {
            return children;
        }
    }

    render() {
        const {
            bsSize,
            children,
            className,
            header,
            isLoading,
            show,
            onCancelled
        } = this.props;

        return (
            <div>
                <Modal
                    bsSize={bsSize}
                    className={classNames(className, 'confirm-modal-dialog')}
                    closeBtn={true}
                    enableEscapeToClose={true}
                    footer={this.renderButtons()}
                    header={header}
                    isLoading={isLoading}
                    show={show}
                    onClose={onCancelled} >
                    {this.renderContent()}
                </Modal>
            </div>
        );
    }
}

export default ConfirmModalDialog;
