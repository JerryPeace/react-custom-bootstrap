import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import styleMaps from '../styleMaps';
import bootstrapUtils from '../utils/bootstrapUtils';
import ConvenientDropdown from '../dropdown/ConvenientDropdown';
const {CLASSES} = styleMaps;
const CLICK = 'click';
const HOVER = 'hover';
const navItemProps = {
    value: PropTypes.string,
    label: PropTypes.node,
    divider: PropTypes.bool,
    hide: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    convenientDropdownProps: PropTypes.object
};

class Navbar extends React.Component {
    static propTypes = {
        activeMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
        toggleEvent: PropTypes.oneOf([CLICK, HOVER]),
        onSelect: PropTypes.func.isRequired,
        navItems: PropTypes.arrayOf(PropTypes.shape({
            ...navItemProps,
            subItems: PropTypes.arrayOf(PropTypes.shape(navItemProps))
        })).isRequired
    };

    static defaultProps = {
        activeMenu: [],
        toggleEvent: HOVER,
        bsClass: CLASSES.navbar,
        bsStyle: 'default',
    };

    constructor(props) {
        super(props);
        this._openedNavDropdown = null;
        this.closeDropdownMenu = ::this.closeDropdownMenu;
    }

    removeHiddenItems(items) {
        items = _.filter(items, (item) => {
            if (item.subItems) {
                item.subItems = this.removeHiddenItems(item.subItems);
            }
            return item.hide !== true;
        });
        return items;
    }

    onItemSelect({activeMenu, activeItem}, event) {
        event.preventDefault();
        this.props.onSelect({
            activeMenu,
            activeItem
        });
    }

    closeDropdownMenu() {
        if (this._openedNavDropdown) {
            this._openedNavDropdown.handleMenuToggled(false);
        }
    }

    renderNavDropdown({navItem, idx, clsName, isActive}) {
        const pathIndex = 1;
        const isParentActive = isActive;
        let dropdownCompo = null;
        const {
            convenientDropdownProps,
            label,
            subItems
        } = navItem;

        return (
            <ConvenientDropdown
                key={idx}
                ref={(el) => dropdownCompo = el}
                onMenuOpened={() => {
                    this._openedNavDropdown = dropdownCompo;
                }}
                className={clsName}
                toggleEvent={this.props.toggleEvent}
                listMaxHeight={'auto'}
                renderDropdownProps={() => {
                    return {container: 'li'};
                }}
                togglerTitle={label}
                togglerRender={(togglerProps) => {
                    const {
                        className,
                        disabled,
                        onClick,
                        togglerDisplay
                    } = togglerProps;

                    return (
                        <a
                            className={className}
                            disabled={disabled}
                            onClick={onClick}
                            role={'button'}
                        >
                            {togglerDisplay}
                            <span className={CLASSES.caret} style={{marginLeft: '4px'}}/>
                        </a>
                    )
                }}
                showCaret={!!subItems && !!subItems.length}
                isCheckStyle={false}
                options={_.map(subItems, (item, idx) => {
                    const {
                        value,
                        ...itemProps
                    } = item;
                    return {
                        key: idx,
                        value: item,
                        ...itemProps
                    };
                })}
                renderMenuItemProps={(option) => {
                    const {
                        value,
                        className
                    } = option.value;
                    const isActive = isParentActive && (value === this.props.activeMenu[pathIndex]);
                    return {
                        active: isActive,
                        className
                    }
                }}
                togglerBsStyle={'plain'}
                onSelect={(selectData, e) => {
                    const activeMenu = [
                        navItem.value,
                        selectData.value
                    ];
                    const activeItem = selectData;
                    this.onItemSelect({activeMenu, activeItem}, e);
                }}
                {...convenientDropdownProps}
            />
        );
    }

    renderSingleItem({navItem, idx, clsName}) {
        const {
            label
        } = navItem;

        const onClick = (e) => {
            const activeMenu = [
                navItem.value
            ];
            const activeItem = navItem;
            this.onItemSelect({activeMenu, activeItem}, e);
        }

        return (
            <li key={idx} className={clsName} >
                <a role={'button'} onClick={onClick}>
                    {label}
                </a>
            </li>
        );
    }

    render() {
        const {
            className,
            activeMenu,
            navItems
        } = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);
        const currentNavItems = this.removeHiddenItems(navItems);
        const pathIndex = 0;

        return (
            <nav className={classNames(bsCls, className)}>
                <ul className={classNames(CLASSES.nav, CLASSES['navbar-nav'])}>
                    {
                        currentNavItems.map((navItem, idx) => {
                            const isActive = (navItem.value === activeMenu[pathIndex]);
                            const clsName = classNames(navItem.className, {
                                'open': isActive
                            });

                            if (navItem.subItems) {
                                return this.renderNavDropdown({navItem, idx, clsName, isActive});
                            } else {
                                return this.renderSingleItem({navItem, idx, clsName});
                            }
                        })
                    }
                </ul>
            </nav>
        );
    }
}


export default Navbar;
