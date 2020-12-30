import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Container from './Container';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import Mask from '../mask/Mask';

class Modal extends Component {

    static propTypes = {
        className: PropTypes.string,
        closeBtn: PropTypes.bool,
        defaultShow: PropTypes.bool,
        dialogClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        enableEscapeToClose: PropTypes.bool,
        onClose: PropTypes.func,
        show: PropTypes.bool,
        header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        footer: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        extraNode: PropTypes.node,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        closeBtn: true,
        defaultShow: true,
        enableEscapeToClose: false,
        isLoading: false
    };

    static Container = Container;
    static Header = Header;
    static Body = Body;
    static Footer = Footer;

    constructor(props) {
        super(props);

        this.state = {
            show: typeof (props.show) === 'undefined' ? props.defaultShow : props.show
        };

        this.onClose = :: this.onClose;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.show !== nextProps.show) {
            this.setState({
                show: nextProps.show
            });
        }
    }

    onClose(e) {
        this.setState({ show: false });
        this.props.onClose && this.props.onClose(e);
    }

    render() {
        const {
            body,
            children,
            className,
            closeBtn,
            dialogClassName,
            enableEscapeToClose,
            extraNode,
            footer,
            header,
            onClose,
            show,
            isLoading,
            ...props
        } = this.props;

        return (
            <Container
                className={classNames(className, {
                    'no-title': !header,
                    'no-footer': !footer
                })}
                dialogClassName={dialogClassName}
                show={this.state.show}
                onEscapePressed={enableEscapeToClose ? onClose : null}
                isLoading={isLoading}
                {...props}
            >
                <Header closeBtn={closeBtn} children={header} onClick={this.onClose} />
                <Body>
                    {body}
                    {children}
                </Body>
                {footer &&
                    <Footer children={footer} />
                }
                {extraNode}
            </Container>
        );
    }
}

export default Modal;
