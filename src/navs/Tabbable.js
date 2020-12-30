import PropTypes from 'prop-types';
import React, { Component } from 'react';
import dom from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import bootstrapUtils from '../utils/bootstrapUtils';
import TabContent from './TabContent';
import NavTabs from './NavTabs';
import { bsStyleNavTabsPropType, ItemsPropType } from './constants.js';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';


class Tabbable extends Component {
    static propTypes = {
        activeTab: PropTypes.any,
        bsStyleNavTabs: bsStyleNavTabsPropType,
        cover: PropTypes.bool,
        enableReordering: PropTypes.bool,
        items: ItemsPropType,
        leftPane: PropTypes.node,
        menuTopOffset: PropTypes.number,
        noWrap: PropTypes.bool,
        reorderTab: PropTypes.func,
        rightPane: PropTypes.node,
        scrollLeft: PropTypes.number,
        onClick: PropTypes.func,
        onDragStart: PropTypes.func,
        onDrop: PropTypes.func,
        onTabsSizeUpdate: PropTypes.func,
        onSubMenuClick: PropTypes.func
    };

    static defaultProps = {
        bsClass: 'tabbable',
        cover: false,
        menuTopOffset: 0
    };

    constructor(props) {
        super(props);

        this.state = { menuItem: null };
        this.hideSubMenu = ::this.hideSubMenu;
        this.toggleSubMenu = ::this.toggleSubMenu;
    }

    componentDidUpdate() {
        if (!this.menu) {
            return;
        }

        const menuElem = dom.findDOMNode(this.menu);
        menuElem.style.visibility = 'hidden';
        menuElem.style.top = this.state.offsetTop + this.props.menuTopOffset + 'px';
        menuElem.style.left = this.state.offsetLeft + 'px';
        setTimeout(() => {
            let offsetLeft = this.state.offsetLeft;
            const menuRight = menuElem.getBoundingClientRect().right;
            const bodyRight = document.body.getBoundingClientRect().right;
            if (menuRight > bodyRight) {
                offsetLeft -= menuRight - bodyRight;
            }
            // calibrate the menu position.
            menuElem.style.left = offsetLeft + 'px';
            menuElem.style.visibility = 'visible';
        }, 33);
    }

    scrollLeft() {
        // We have to use child to get real NavTabs because it is wrapped by HOC
        this.navTabs.child.scrollLeft();
    }

    scrollRight() {
        // We have to use child to get real NavTabs because it is wrapped by HOC
        this.navTabs.child.scrollRight();
    }

    toggleSubMenu(menuItem, offsetTop, offsetLeft) {
        if (this.state.menuItem === menuItem) {
            this.hideSubMenu();
        } else {
            this.setState({ menuItem, offsetTop, offsetLeft });
        }
    }

    renderNavTabs(activeTab) {
        return (
            <NavTabs
                ref ={(ref) => {
                    this.navTabs = ref;
                }}
                activeTab={activeTab}
                bsStyle={this.props.bsStyleNavTabs}
                cover={this.props.cover}
                enableReordering={this.props.enableReordering}
                items={this.props.items}
                leftPane={this.props.leftPane}
                noWrap={this.props.noWrap}
                reorderTab={this.props.reorderTab}
                rightPane={this.props.rightPane}
                scrollLeft={this.props.scrollLeft}
                toggleSubMenu={this.toggleSubMenu}
                onTabsSizeUpdate={this.props.onTabsSizeUpdate}
                onClick={this.props.onClick}
                onDragStart={this.props.onDragStart}
                onDrop={this.props.onDrop} />
        );
    }

    renderTabContent(activeTab) {
        return (
            <TabContent items={this.props.items} activeTab={activeTab}>
                {this.props.children}
            </TabContent>
        );
    }

    hideSubMenu() {
        this.setState({ menuItem: null });
    }

    renderSubMenus() {
        const { onSubMenuClick } = this.props;
        const menuItem = this.state.menuItem;

        return (menuItem &&
            <Menu ref={(r) => this.menu = r} isMenuOpen={true} onRootClose={this.hideSubMenu}>
            {menuItem.subMenu.map((sm) => {
                return (
                    <MenuItem key={sm.value}
                        selectData={sm.value}
                        onSelect={(data) => {
                            onSubMenuClick && onSubMenuClick(data.selectData, menuItem.value,
                                                             data.event);
                            this.hideSubMenu();
                            data.event.stopPropagation();
                        }}>
                        {sm.text}
                    </MenuItem>
                );
            })}
        </Menu>);
    }

    findActiveTabKey() {
        if (!this.props.items || !this.props.items.length) {
            return null;
        }

        const found = _.find(this.props.items, (item) => {
            return item.value === this.props.activeTab;
        });

        return found ? this.props.activeTab : this.props.items[0].value;
    }

    render() {
        const bsCls = bootstrapUtils.getCls(this.props);
        const activeTab = this.findActiveTabKey();

        const clsNames = classNames(this.props.className, bsCls, {
            'menu-active': !!this.state.menuItem
        });

        return (
            <div className={clsNames}>
                {this.renderNavTabs(activeTab)}
                {this.renderTabContent(activeTab)}
                {this.renderSubMenus()}
            </div>
        );
    }
}

export default Tabbable;
