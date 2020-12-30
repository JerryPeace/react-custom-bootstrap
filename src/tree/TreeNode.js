import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Highlighter from 'react-highlight-words';
import IndeterminateCheckbox from '../tmAgGrid/IndeterminateCheckbox';
import TmIcon from '../icon/TmIcon';
import nodeShape from './nodeShape';

class TreeNode extends Component {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        hide: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        node: PropTypes.object.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        treeId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,
        children: PropTypes.node,
        className: PropTypes.string,
        icon: PropTypes.node,
        rawChildren: PropTypes.arrayOf(nodeShape),
        collapseRenderer: PropTypes.func,
        checkboxRenderer: PropTypes.func,
        iconRenderer: PropTypes.func,
        labelRenderer: PropTypes.func,
        // search
        searchKeyword: PropTypes.string
    };

    static defaultProps = {
        children: null,
        className: null,
        icon: null,
        rawChildren: null,
        showNodeIcon: true
    };

    constructor(props) {
        super(props);

        this.handleExpand = ::this.handleExpand;
        this.handleCheck = ::this.handleCheck;
    }

    handleCheck() {
        const {
            checked,
            optimisticToggle,
            value,
            rawChildren,
            onCheck
        } = this.props;
        let isChecked = false;

        if (checked === 0) {
            // Toggle off state to checked
            isChecked = true;
        } else if (checked === 2) {
            // Toggle partial state based on cascade model
            isChecked = optimisticToggle;
        }

        onCheck({
            value,
            checked: isChecked,
            children: rawChildren
        });
    }

    handleExpand() {
        const {
            expanded,
            expandDisabled,
            value,
            onExpand
        } = this.props;

        if (!expandDisabled) {
            onExpand({
                value,
                expanded: !expanded
            })
        }
    }

    hasChildren() {
        return this.props.rawChildren !== null;
    }

    getSpaceEncode(value) {
        return _.isString(value) ? _.replace(value, /  /gm, ' \u00a0') : value;
    }

    getInputId() {
        return `${this.props.treeId}-${this.props.value.split(' ').join('_')}`;
    }

    renderCollapse() {
        const {
            collapseRenderer,
            expanded,
            node
        } = this.props;
        let collapse;

        if (collapseRenderer) {
            collapse = collapseRenderer({
                node,
                hasChildren: this.hasChildren,
                handleExpand: this.handleExpand,
                element: this
            });
        } else {
            const collapseClass = classNames({
                'rct-collapse': true,
                'rct-expand-open': expanded,
                'rct-expand-close': !expanded
            });
            collapse = (
                <span className={collapseClass}>
                    {this.hasChildren() ?
                        <TmIcon
                            name={expanded ? 'caret-right-down' : 'caret-right-o'}
                            size={16}
                            onClick={this.handleExpand} /> :
                        <span className='rct-empty-icon'></span>
                    }
                </span>
            );
        }

        return collapse;
    }

    renderCheckbox() {
        const {
            checkboxRenderer,
            checked,
            node
        } = this.props;
        const inputId = this.getInputId();
        let checkbox;

        if (checkboxRenderer) {
            checkbox = checkboxRenderer({
                node,
                inputId,
                handleCheck: this.handleCheck,
                element: this
            });
        } else {
            const checkboxClass = classNames({
                'rct-checkbox': true,
                'rct-checkbox-uncheck': checked === 0,
                'rct-checkbox-check': checked === 1,
                'rct-checkbox-half-check': checked === 2,
                'checkbox': true,
                'checkbox-info': true
            });
            checkbox = (
                <span className={checkboxClass}>
                    <IndeterminateCheckbox
                        id={inputId}
                        checked={checked === 1}
                        indeterminate={checked === 2}
                        onChange={this.handleCheck} />
                    <label htmlFor={inputId} />
                </span>
            );
        }

        return checkbox;
    }

    renderIcon() {
        const {
            expanded,
            icon,
            iconRenderer,
            showNodeIcon
        } = this.props;
        let nodeIcon;

        if (iconRenderer) {
            nodeIcon = iconRenderer({
                node,
                hasChildren: this.hasChildren,
                element: this
            });
        } else {
            const nodeIconClass = classNames({
                'rct-icon': true,
                'rct-icon-leaf': !this.hasChildren(),
                'rct-icon-parent-open': expanded,
                'rct-icon-parent-close': !expanded
            });
            nodeIcon = icon && (
                <span className={nodeIconClass}>
                    {icon}
                </span>
            );
        }

        return showNodeIcon && nodeIcon;
    }

    renderLabel() {
        const {
            label,
            labelRenderer,
            node,
            searchKeyword
        } = this.props;
        let labelText;

        if (labelRenderer) {
            labelText = labelRenderer({
                node,
                searchKeyword,
                Highlighter,
                element: this
            });
        } else {
            labelText = (
                <span className='rct-label'>
                    <Highlighter
                        autoEscape={true}
                        searchWords={[this.getSpaceEncode(searchKeyword)]}
                        textToHighlight={this.getSpaceEncode(label)} />
                </span>
            );
        }

        return labelText;
    }

    renderChildren() {
        return this.props.expanded && this.props.children;
    }

    render() {
        const {
            className,
            disabled,
            hide,
            value
        } = this.props;
        const treeNodeClass = classNames({
            'rct-node': true,
            'rct-node-parent': this.hasChildren(),
            'rct-node-leaf': !this.hasChildren(),
            'rct-disabled': disabled,
            'rct-hide': hide
        }, className);

        return (
            <li className={treeNodeClass}>
                <span className='rct-text' data-id={value}>
                    {this.renderCollapse()}
                    {this.renderCheckbox()}
                    <label className='rct-title' htmlFor={this.getInputId()}>
                        {this.renderIcon()}
                        {this.renderLabel()}
                    </label>
                </span>
                {this.renderChildren()}
            </li>
        );
    }
}

export default TreeNode;
