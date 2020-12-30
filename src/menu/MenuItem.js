import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import styleMaps from '../styleMaps';
import faUtils from '../utils/faUtils';

class MenuItem extends Component {
    static propTypes = {
        active: PropTypes.bool,
        divider: PropTypes.bool,
        disabled: PropTypes.bool,
        deselectable: PropTypes.bool,
        faProps: PropTypes.object,
        header: PropTypes.bool,
        clickableHeader: PropTypes.bool,
        href: PropTypes.string,
        iconEl: PropTypes.node,
        noRootClose: PropTypes.bool,
        selectData: PropTypes.any,
        subMenu: PropTypes.node,
        onActiveClicked: PropTypes.func, // Dispatched when this menu item is active, not
                                         // deseletable, and clicked by user.
        onClick: PropTypes.func, // Dispatched when this menu is not disabled and clicked
        onItemSelect: PropTypes.func, // Dispatched when this menu is not disabled and clicked
        onSelect: PropTypes.func, // Dispatched when this menu is not disabled and clicked
        faStyle: PropTypes.string,
        sidemenu: PropTypes.node
    };

    static defaultProps = {
        divider: false,
        disabled: false,
        deselectable: false,
        header: false,
        noRootClose: false,
        href: ''
    };

    constructor(props, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const {
            children,
            href,
            deselectable,
            disabled,
            noRootClose,
            onActiveClicked,
            onItemSelect, // props from Menu
            onSelect,
            onClick,
            selectData,
            active
        } = this.props;

        if (!href || disabled) {
            event.preventDefault();
        }

        if (disabled || (active && !deselectable)) {
            active && onActiveClicked && onActiveClicked();
            return;
        }

        onSelect && onSelect({
            selectData,
            event,
            itemContent: children
        });

        onClick && onClick(event);

        onItemSelect && onItemSelect({
            selectData,
            event,
            itemContent: children
        });

        noRootClose && event.nativeEvent.stopImmediatePropagation();
    }

    renderIcon() {
        const { iconEl, faProps } = this.props;
        const faClass = faUtils.getCls(this.props);

        let icon = null;

        if (iconEl) {
            icon = iconEl;
        } else if (faClass) {
            icon = <i {...faProps} className={faClass} />;
        }

        return icon ? <span className='item-icon'>{icon}</span> : null;
    }

    renderDivider() {
        const { className } = this.props;
        const { divider } = styleMaps.CLASSES;

        return (
            <li className={classNames(className, divider)} />
        );
    }

    renderHeader() {
        const { children, className, clickableHeader } = this.props;
        const { 'dropdown-header': dropdownHeader } = styleMaps.CLASSES;

        return (
            <li className={classNames(className, dropdownHeader)}>
                {children}
            </li>
        );
    }

    renderClickableHeader() {
        const { children, className, clickableHeader } = this.props;
        const { 'dropdown-header': dropdownHeader } = styleMaps.CLASSES;

        return (
            <li
                className={classNames(className, dropdownHeader, 'clickable')}
                onClick={this.handleClick}
            >
                {children}
            </li>
        );
    }

    renderItem() {
        const {
            active,
            children,
            className,
            deselectable,
            disabled,
            divider,
            faProps,
            faStyle, // We don't use this props at this function but for extracting it from rest.
            header,
            clickableHeader,
            href,
            iconEl,
            noRootClose,
            onActiveClicked, // We don't use this props at this function but for extracting it from
                             // rest.
            onItemSelect,
            onSelect,
            selectData,
            sidemenu, // We don't use this props at this function but for extracting it from rest.
            subMenu,
            ...rest
        } = this.props;
        let style = null;

        if (subMenu) {
            style = {
                position: 'relative'
            };
        }

        return (
            <li
                {...rest}
                className={classNames(className, {
                    active,
                    disabled
                })}
                style={style}
                >
                <a
                    {...rest}
                    href={href}
                    onClick={this.handleClick}
                    >
                    {this.renderIcon()}
                    {children}
                </a>
                {subMenu && React.cloneElement(subMenu, {subMenu: true})}
            </li>
        );
    }

    render() {
        const { divider, header, clickableHeader } = this.props;

        if (divider) {
            return this.renderDivider();
        } else if (header) {
            return this.renderHeader();
        } else if (clickableHeader) {
            return this.renderClickableHeader();
        } else {
            return this.renderItem();
        }
    }
}

export default MenuItem;
