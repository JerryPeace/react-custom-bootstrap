import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { bootstrapUtils } from '../utils';
import styleMaps from '../styleMaps';
import RootCloseWrapper from './RootCloseWrapper';
import MenuItem from './MenuItem';

class Menu extends Component {
    static propTypes = {
        bsClass: PropTypes.string,
        bsSize: PropTypes.string,
        bsStyle: PropTypes.string,
        isMenuOpen: PropTypes.bool,
        isMenuAlignRight: PropTypes.bool,
        isMenuCheckStyle: PropTypes.bool,
        isSubMenuOpenLeft: PropTypes.bool,
        noRootClose: PropTypes.bool,
        onRootClose: PropTypes.func,
        onItemClick: PropTypes.func,
        onItemSelect: PropTypes.func,
        sideMenu: PropTypes.element,
        style: PropTypes.object,
        subMenu: PropTypes.bool
    };

    static defaultProps = {
        bsClass: 'dropdown-menu',
        isMenuOpen: false,
        isMenuAlignRight: false,
        isMenuCheckStyle: false,
        isSubMenuOpenLeft: false,
        noRootClose: false
    };

    constructor(props) {
        super(props);
        this.state = {
            subMenuLeft: '100%' // open right side by default
        };
    }

    componentDidUpdate(prevProps) {
        const {
            noRootClose,
            subMenu,
            isMenuOpen,
            isSubMenuOpenLeft
        } = this.props;

        if (isMenuOpen
            && !prevProps.isMenuOpen
            && subMenu
            && isSubMenuOpenLeft
            && !noRootClose) {
            /* eslint-disable react/no-did-update-set-state */
            this.setState({ subMenuLeft: -this.node.getNode().getBoundingClientRect().width });
            /* eslint-enable react/no-did-update-set-state */
        }
    }

    render() {
        const {
            className,
            children,
            style,
            isMenuOpen,
            isMenuAlignRight,
            isMenuCheckStyle,
            subMenu,
            sideMenu,
            noRootClose,
            onRootClose,
            onItemSelect,
            isSubMenuOpenLeft,
            bsClass,
            bsSize,
            bsStyle,
            ...props
        } = this.props;
        const { subMenuLeft } = this.state;
        const bsCls = bootstrapUtils.getCls(this.props);
        let component = null;
        let menuStyle = {
            display: isMenuOpen ? 'block' : 'none'
        };

        if (subMenu) {
            menuStyle = {
                ...menuStyle,
                position: 'absolute',
                top: 0,
                left: subMenuLeft,
                marginTop: 0
            };
        } else if (sideMenu) {
            menuStyle = {
                ...menuStyle,
                display: isMenuOpen ? 'table-cell' : 'none',
                border: 'none',
                margin: 0,
                padding: 0,
                position: 'relative',
                top: 0,
                height: '100%',
                boxShadow: 'none',
                verticalAlign: 'top',
                float: 'none'
            };
        }

        component = (
            <ul
                {...props}
                className={classNames(className, bsCls, {
                    [styleMaps.CLASSES['check-style']]: isMenuCheckStyle,
                    [styleMaps.CLASSES['dropdown-menu-right']]: !sideMenu && isMenuAlignRight
                })}
                style={{
                    ...menuStyle,
                    ...style
                }}
            >
                {React.Children.map(children, (child) => {
                    if (child && child.type === MenuItem) {
                        return React.cloneElement(child, {onItemSelect});
                    } else {
                        return child;
                    }
                })}
            </ul>
        );

        if (!sideMenu && !noRootClose) {
            component = (
                <RootCloseWrapper
                    disabled={!isMenuOpen}
                    onRootClose={onRootClose}
                    ref={node => this.node = node}
                >
                    {component}
                </RootCloseWrapper>
            );
        }

        return component;
    }
}

export default Menu;
