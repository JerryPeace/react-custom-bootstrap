import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { DragDropContext as dndContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import bootstrapUtils from '../utils/bootstrapUtils';
import { ItemsPropType } from './constants';
import TabLabel from './TabLabel';

class NavTabs extends Component {
    static propTypes = {
        activeTab: PropTypes.any,
        cover: PropTypes.bool,
        enableReordering: PropTypes.bool,
        items: ItemsPropType,
        leftPane: PropTypes.node,
        noWrap: PropTypes.bool,
        reorderTab: PropTypes.func,
        rightPane: PropTypes.node,
        onClick: PropTypes.func,
        onDragStart: PropTypes.func,
        onDrop: PropTypes.func,
        onTabsSizeUpdate: PropTypes.func,
        toggleSubMenu: PropTypes.func
    };

    static defaultProps = {
        bsClass: 'nav'
    };

    componentDidUpdate() {
        // Please note this.list.children is a DOMNodeArray instead of normal array. We cannot
        // iterate it.
        let desiredWidth = 0;
        for (let i = this.list.children.length - 1; i >= 0; i--) {
            desiredWidth += this.list.children[i].offsetWidth;
        }
        this.props.onTabsSizeUpdate && this.props.onTabsSizeUpdate(desiredWidth);

        const activeIndex = _.findIndex(this.props.items, (item) => {
            return item.value === this.props.activeTab;
        });

        const activeLi = this.list.children[activeIndex];
        if (!activeLi) {
            return;
        }

        const containerWidth = this.list.getBoundingClientRect().width;
        const activeLeft = activeLi.offsetLeft;
        const activeRight = activeLi.offsetLeft + activeLi.offsetWidth;
        const scrollRight = this.list.scrollLeft + containerWidth;
        if (scrollRight < activeRight) {
            this.list.scrollLeft += activeRight - scrollRight;
        } else if (this.list.scrollLeft > activeLeft) {
            this.list.scrollLeft = activeLeft;
        }
    }

    scrollLeft() {
        this.list.scrollLeft -= 60;
    }

    scrollRight() {
        this.list.scrollLeft += 60;
    }

    render() {
        const {
            activeTab,
            className,
            cover,
            enableReordering,
            items,
            leftPane,
            noWrap,
            reorderTab,
            rightPane,
            onClick,
            onDragStart,
            onDrop,
            toggleSubMenu
        } = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);
        const clsNames = classNames('nav-pane', className, bsCls,
            { 'cover': cover, 'no-wrap': noWrap });

        return (
            <div className='tabs'>
                <div className='left-pane'>{leftPane}</div>
                <ul className={clsNames} ref={(ref) => {
                    this.list = ref;
                }}>
                    {items.map((item, index) => (
                        <TabLabel
                            activeTab={activeTab}
                            className={item.className}
                            disabled={item.disabled}
                            enableReordering={enableReordering}
                            index={index}
                            item={item}
                            key={item.value}
                            onClick={activeTab === item.value ? null : onClick}
                            onDragStart={onDragStart}
                            onDrop={onDrop}
                            reorderTab={reorderTab}
                            toggleSubMenu={toggleSubMenu}/>
                    ))}
                </ul>
                <div className='right-pane'>{rightPane}</div>
            </div>
        );
    }
}

export default dndContext(HTML5Backend)(NavTabs);
