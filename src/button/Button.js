import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styleMaps from '../styleMaps';
import CustomPropTypes from '../utils/CustomPropTypes';
import bootstrapUtils from '../utils/bootstrapUtils';
import faUtils from '../utils/faUtils';
import Loader from '../loader/Loader';
import TmIcon from '../icon/TmIcon';

class Button extends React.Component {

    static propTypes = {
        isLoading: PropTypes.bool,
        active: PropTypes.bool,
        disabled: PropTypes.bool,
        block: PropTypes.bool,
        // navItem: React.PropTypes.bool,
        // navDropdown: React.PropTypes.bool,
        /**
         * You can use a custom element for this component
         */
        componentClass: CustomPropTypes.elementType,
        href: PropTypes.string,
        target: PropTypes.string,
        onClick: PropTypes.func,
        type: PropTypes.string,
        buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        isDropdown: PropTypes.bool,
        isCaretStyle: PropTypes.bool,
        faStyle: PropTypes.string,
        faProps: PropTypes.object,
        tmStyle: PropTypes.string,
        tmProps: PropTypes.object,
        iconEl: PropTypes.node,
        bsClass: PropTypes.string,
        bsStyle: PropTypes.string,
        bsSize: PropTypes.oneOf(['lg', 'sm', 'xs']),
        isIconOnly: PropTypes.bool,
        standalone: PropTypes.bool
    };

    static defaultProps = {
        isLoading: false,
        active: false,
        block: false,
        bsClass: 'button',
        bsStyle: 'default',
        disabled: false,
        standalone: true,
        type: 'button',
        isDropdown: false,
        isCaretStyle: false,
        faProps: {}
    };

    getComponent() {
        const {componentClass, href, target} = this.props;
        if (componentClass) {
            return componentClass;
        } else {
            return href || target ? 'a' : 'button';
        }
    }

    getClassName() {
        const {'dropdown-toggle': dropdownToggle} = styleMaps.CLASSES;
        const bsCls = bootstrapUtils.getCls(this.props);

        const {
            className,
            active: isActive,
            block: isBlock,
            disabled: isDisabled,
            isDropdown,
            isIconOnly
        } = this.props;

        const elementCls = {
            active: isActive,
            'btn-block': isBlock,
            disabled: isDisabled,
            isDropdown,
            'btn-icon-only': isIconOnly,
            [dropdownToggle]: isDropdown
        };
        return classNames(bsCls, elementCls, className);
    }

    renderIcon() {
        const {
            isLoading,
            iconEl,
            faStyle,
            faProps,
            tmStyle,
            tmProps
        } = this.props;
        const faClass = faUtils.getCls(this.props);

        let icon = null;

        if (isLoading) {
            icon = <Loader bsSize={styleMaps.SIZES.sm} />;
        } else if (iconEl) {
            icon = iconEl;
        } else if (tmStyle) {
            icon = <TmIcon name={tmStyle} size={16} { ...tmProps } />
        } else if (faClass) {
            icon = <i {...faProps} className={faClass} />;
        }

        if (icon) {
            return (
                <span className={styleMaps.CLASSES['btn-icon']}>
                    {icon}
                </span>
            );
        } else {
            return null;
        }
    }

    renderContent() {
        const {buttonText, children} = this.props;
        if (buttonText || children) {
            return (
                <span className={styleMaps.CLASSES['btn-content']} >
                    {buttonText}
                    {children}
                </span>
            );
        } else {
            return null;
        }
    }

    renderCaret() {
        const {caret} = styleMaps.CLASSES;
        if (this.props.isCaretStyle) {
            return <span className={caret} />;
        } else {
            return null;
        }
    }


    render() {
        const Component = this.getComponent();
        let {isLoading, iconEl, active, block, bsClass, bsStyle, bsSize, standalone, buttonText, isDropdown, isCaretStyle, tmStyle, tmProps, faStyle, faProps, isIconOnly, componentClass, ...rest} = this.props;

        if (Component === 'a') {
            delete rest.disabled;
            rest.href = this.props.href || '#';
        }

        return (
            <Component
                key={'button'}
                {...rest}
                className={this.getClassName()} >
                {this.renderIcon()}
                {this.renderContent()}
                {this.renderCaret()}
            </Component>
        );
    }
}

export default Button;
