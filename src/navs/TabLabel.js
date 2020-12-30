import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import {
    DragSource as dragSource,
    DropTarget as dropTarget
} from 'react-dnd';
import _ from 'lodash';
import classnames from 'classnames';
import { ItemPropType } from './constants';
import SubMenu from './SubMenu';

export const tabLabelSource = {
    beginDrag(props) {
        props.onDragStart && props.onDragStart(props.index, props.item);
        return {
            index: props.index,
            item: props.item
        };
    }
};

const collectSource = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
});

export const tabLabelTarget = {
    drop(props) {
        props.onDrop && props.onDrop(props.index, props.item);
    },

    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const dropIndex = props.index;
        if (dragIndex === dropIndex) {
            return;
        }

        // Determine rectangle on screen
        const compRect = findDOMNode(component).getBoundingClientRect();
        const middle = (compRect.left + compRect.right) / 2;

        const mouseOffset = monitor.getClientOffset();

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging right, only move when the cursor is below 50%
        // When dragging left, only move when the cursor is above 50%
        // Dragging right
        if (dragIndex < dropIndex && mouseOffset.x < middle) {
            return;
        }

        // Dragging left
        if (dragIndex > dropIndex && mouseOffset.x > middle) {
            return;
        }

        props.reorderTab(dragIndex, dropIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = dropIndex;
    }
};

const collectTarget = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
});

const TabLabel = (props) => {
    const {
        activeTab,
        className,
        connectDropTarget,
        connectDragSource,
        enableReordering,
        isDragging,
        item,
        onClick,
        toggleSubMenu
    } = props;

    const {
        disabled,
        href,
        noDnD,
        ButtonClass,
        subMenu,
        text,
        value
    } = item;

    const onClickHandler = (evt) => ((onClick && !disabled) && onClick(value, evt));

    const button = ButtonClass
            ? (<ButtonClass className='tab-label' disabled={disabled} onClick={onClickHandler}>{text}</ButtonClass>)
            : (<button disabled={disabled} href={href || '#'} onClick={onClickHandler}>{text}</button>);

    const ui = (
        <li key={value}
            className={classnames(className, {
                active: activeTab === value,
                disabled,
                dragging: isDragging
            })}>
            {button}
            {subMenu &&
                <SubMenu menu={subMenu} toggleSubMenu={(top, left) => {
                    toggleSubMenu(item, top, left);
                }}/>
            }
        </li>
    );

    return enableReordering && !noDnD ? connectDropTarget(connectDragSource(ui)) : ui;
};

TabLabel.propTypes = {
    activeTab: PropTypes.any,
    enableReordering: PropTypes.bool,
    index: PropTypes.number,
    item: ItemPropType,
    reorderTab: PropTypes.func,
    onClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    toggleSubMenu: PropTypes.func,
    // for drag and drop from HOC
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

export default _.flow(
    dragSource('TabLabel', tabLabelSource, collectSource),
    dropTarget('TabLabel', tabLabelTarget, collectTarget))(TabLabel);
