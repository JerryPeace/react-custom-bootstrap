import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import CloseIcon from '../icon/CloseIcon';
import _ from 'lodash';

const ALERT_TYPE = {
    NORMAL: 'normal',
    TOAST: 'toast'
};

class Alert extends React.Component {

    static propTypes = {
        bsStyle: PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
        onClose: PropTypes.func,
        closeBtn: PropTypes.bool,
        titleText: PropTypes.string,
        bsClass: PropTypes.string,
        isShortMsg: PropTypes.bool,
        closable: PropTypes.bool,
        visible: PropTypes.bool,
        type: PropTypes.oneOf([ALERT_TYPE.NORMAL, ALERT_TYPE.TOAST])
    };

    static defaultProps = {
        bsClass: 'alert',
        bsStyle: 'warning',
        closable: true,
        isShortMsg: false
    };

    constructor (props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.state = {
            alertVisible: true
        };
    }

    renderTitle() {
        let inlineStyle = {
            marginRight: '5px'
        };

        const titleText = this.props.titleText;

        return (
            <strong
                className={'tm-alert-title'}
                style={inlineStyle}>
                {titleText}
            </strong>
        );
    }

    renderDismissButton() {
        return (
            <CloseIcon onClick={this.onClose} />
        );
    }

    onClose(e) {
        const { onClose } = this.props;
        const onCloseResult = onClose && onClose(e);

        if (typeof onCloseResult === 'object' && _.isFunction(onCloseResult.then)) {
            onClose(e).then(() => {
                this.close();
            });
        } else {
            this.close();
        }

    }

    close() {
        // it will be controllable if visible has value
        typeof this.props.visible === 'undefined' && this.setState({ alertVisible: false });
    }

    open() {
        this.setState({
            alertVisible: true
        });
    }

    getVisible() {
        const { visible } = this.props;
        if (typeof visible === 'undefined') {
            return this.state.alertVisible;
        } else {
            return visible;
        }
    }

    render() {
        let isClosable = this.props.closable;
        // add specific classes
        let classes = {
            'tm-alert-dismissable': isClosable,
            'tm-alert-block': !this.props.isShortMsg,
            'toast-alert': this.props.type === ALERT_TYPE.TOAST
        };

        let bsCls = bootstrapUtils.getCls(this.props);

        const {titleText, bsClass, bsStyle, closable, isShortMsg, onClose, ...rest} = this.props;

        if (this.getVisible()) {
            return (
                <div {...rest} className={classNames(this.props.className, classes, bsCls)}>
                    {isClosable ? this.renderDismissButton() : null}
                    {titleText ? this.renderTitle() : null}
                    {this.props.children}
                </div>
            );
        }

        return null;
    }
}

Alert.ALERT_TYPE = ALERT_TYPE;

export default Alert;
