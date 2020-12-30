import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import styleMaps from '../styleMaps';
import RootCloseWrapper from '../menu/RootCloseWrapper';

class Dropdown extends Component {
    static propTypes = {
        container: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        isMenuOpen: PropTypes.bool,
        isSideMenuOpen: PropTypes.bool,
        isSideMenuOpenLeft: PropTypes.bool,
        menu: PropTypes.element,
        sideMenu: PropTypes.element,
        toggle: PropTypes.any.isRequired,
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'dropdown',
        container: 'div',
        isMenuOpen: false,
        isSideMenuOpen: false,
        isSideMenuOpenLeft: false
    };

    renderMenu(shouldRenderSub) {
        const { isMenuOpen, menu } = this.props;
        return shouldRenderSub ? this.renderMenuWithSub() : React.cloneElement(menu, {isMenuOpen});
    }

    renderMenuWithSub() {
        const {
            isMenuOpen,
            isSideMenuOpen,
            isSideMenuOpenLeft,
            menu,
            sideMenu,
            ...rest
        } = this.props;
        const {onRootClose} = menu.props;
        const wrapperStyles = {
            display: isMenuOpen ? 'table' : 'none',
            position: 'absolute',
            top: '100%',
            right: isSideMenuOpenLeft ? 0 : 'auto',
            left: !isSideMenuOpenLeft ? 0 : 'auto',
            border: '1px solid #bbb',
            boxShadow: '0 2px 4px rgba(0, 0, 0, .3)',
            marginTop: -1
        };
        const subWrapperStyles = {
            display: isSideMenuOpen ? 'table-cell' : 'none',
            padding: 12,
            verticalAlign: 'top',
            borderRight: isSideMenuOpenLeft ? '1px solid #ddd' : 'none',
            borderLeft: isSideMenuOpenLeft ? 'none' : '1px solid #ddd',
            background: '#fff'
        };

        return (
            <RootCloseWrapper disabled={!isMenuOpen} onRootClose={onRootClose}>
                <div style={wrapperStyles}>
                    {!isSideMenuOpenLeft && React.cloneElement(menu, {isMenuOpen, sideMenu})}
                    <div style={subWrapperStyles}>{sideMenu}</div>
                    {isSideMenuOpenLeft && React.cloneElement(menu, {isMenuOpen, sideMenu})}
                </div>
            </RootCloseWrapper>
        );
    }

    render() {
        const {
            bsClass,
            className,
            children,
            container: Component,
            isMenuOpen,
            isSideMenuOpen,
            isSideMenuOpenLeft,
            menu,
            sideMenu,
            toggle,
            ...rest
        } = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <Component
                {...rest}
                className={classNames(className, bsCls, styleMaps.CLASSES['button-group'], {
                    open: isMenuOpen
                })}
                >
                {toggle}
                {menu && this.renderMenu(sideMenu)}
            </Component>
        );
    }
}

export default Dropdown;
