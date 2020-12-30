import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import TreeNode from './TreeNode';
import nodeShape from './nodeShape';

class CheckboxTree extends Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(nodeShape).isRequired,
        checked: PropTypes.arrayOf(PropTypes.string),
        disabled: PropTypes.bool,
        expandAllDefault: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expanded: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        nameAsArray: PropTypes.bool,
        noCascade: PropTypes.bool,
        optimisticToggle: PropTypes.bool,
        showNodeIcon: PropTypes.bool,
        onCheck: PropTypes.func,
        onExpand: PropTypes.func,
        // tree node
        collapseRenderer: PropTypes.func,
        checkboxRenderer: PropTypes.func,
        iconRenderer: PropTypes.func,
        labelRenderer: PropTypes.func,
        // search
        isNodeHideFunc: PropTypes.func,
        isKeywordMatchFunc: PropTypes.func,
        searchKeyword: PropTypes.string,
        searchEmptyText: PropTypes.string,
        searchEmptyRenderer: PropTypes.func
    };

    static defaultProps = {
        checked: [],
        disabled: false,
        expandAllDefault: true,
        expandDisabled: false,
        expanded: [],
        name: undefined,
        nameAsArray: false,
        noCascade: false,
        optimisticToggle: true,
        showNodeIcon: true,
        onCheck: () => {},
        onExpand: () => {}
    };

    constructor(props) {
        super(props);
        const {
            checked,
            expanded,
            expandAllDefault,
            nodes
        } = props;

        this.id = `rct-${_.uniqueId()}`;
        this.nodes = {};
        this.formattedNodes = {};
        this.expandAllDefault = expandAllDefault;
        this.flattenNodes(nodes);
        this.unserializeLists({
            checked,
            expanded
        });

        this.handleCheck = ::this.handleCheck;
        this.handleExpand = ::this.handleExpand;
    }

    componentWillReceiveProps({ nodes, checked, expanded }) {
        if (!_.isEqual(this.props.nodes, nodes)) {
            this.flattenNodes(nodes);
        }

        this.unserializeLists({ checked, expanded });
    }

    handleCheck(node) {
        const { noCascade, onCheck } = this.props;

        this.toggleChecked(node, node.checked, noCascade);
        onCheck(this.serializeList('checked'));
    }

    handleExpand(node) {
        const { onExpand } = this.props;

        if (this.expandAllDefault) {
            this.expandAllDefault = false;
        }

        this.toggleNode('expanded', node, node.expanded);
        onExpand(this.serializeList('expanded'));
    }

    isKeywordMatch(node) {
        const { searchKeyword, isKeywordMatchFunc } = this.props;
        const { label } = node;

        return isKeywordMatchFunc ?
            isKeywordMatchFunc({ node, searchKeyword }) :
            _.includes(_.toLower(label), _.toLower(searchKeyword));
    }

    isNodeHide(node) {
        const { isNodeHideFunc, searchKeyword } = this.props;
        const isParentOrSomeChildMatch = (node) => {
            const isParentMatch = this.isKeywordMatch(node);
            const isSomeChildMatch = _.some(node.children, (child) => {
                return child.children ?
                    isParentOrSomeChildMatch(child) :
                    this.isKeywordMatch(child);
            });
            return isParentMatch || isSomeChildMatch;
        };

        return isNodeHideFunc ?
            isNodeHideFunc({ node, searchKeyword }) :
            _.isString(searchKeyword) && searchKeyword !== '' && !isParentOrSomeChildMatch(node);
    }

    getLeafNodes() {
        return _.filter(this.nodes, ({ children }) => children === null);
    }

    getShowNodes() {
        return _.filter(this.formattedNodes, ({ hide }) => !hide);
    }

    getFormattedNodes(nodes) {
        return _.map(nodes, (node) => {
            const formatted = { ...node };

            formatted.checked = this.nodes[node.value].checked;
            formatted.expanded = this.nodes[node.value].expanded;
            formatted.hide = this.isNodeHide(node);

            if (_.isArray(node.children) && _.size(node.children) > 0) {
                formatted.children = this.getFormattedNodes(formatted.children);

                if (this.expandAllDefault) {
                    this.nodes[node.value].expanded = true
                    formatted.expanded = true;
                }
            } else {
                formatted.children = null;
            }
            return formatted;
        });
    }

    getCheckState(node, noCascade) {
        if (node.children === null || noCascade) {
            return node.checked ? 1 : 0;
        }

        if (this.isEveryChildChecked(node)) {
            return 1;
        }

        if (this.isSomeChildChecked(node)) {
            return 2;
        }

        return 0;
    }

    getDisabledState(node, parent, disabledProp, noCascade) {
        if (disabledProp) {
            return true;
        }

        if (!noCascade && parent.disabled) {
            return true;
        }

        return Boolean(node.disabled);
    }

    toggleChecked(node, isChecked, noCascade) {
        if (node.children === null || noCascade) {
            // Set the check status of a leaf node or an uncoupled parent
            this.toggleNode('checked', node, isChecked);
        } else {
            // Percolate check status down to all children
            _.forEach(node.children, (child) => {
                this.toggleChecked(child, isChecked);
            });
        }
    }

    toggleNode(key, node, toggleValue) {
        this.nodes[node.value][key] = toggleValue;
    }

    flattenNodes(nodes) {
        if (!_.isArray(nodes) || _.size(nodes) === 0) {
            return;
        }

        _.forEach(nodes, (node) => {
            this.nodes[node.value] = node;
            this.flattenNodes(node.children);
        });
    }

    unserializeLists(lists) {
        // Reset values to false
        _.forEach(_.keys(this.nodes), (value) => {
            _.forEach(_.keys(lists), (listKey) => {
                this.nodes[value][listKey] = false;
            });
        });

        // Unserialize values and set their nodes to true
        _.forEach(_.keys(lists), (listKey) => {
            _.forEach(lists[listKey], (value) => {
                this.nodes[value][listKey] = true;
            });
        });
    }

    serializeList(key) {
        const list = [];

        _.forEach(_.keys(this.nodes), (value) => {
            if (this.nodes[value][key]) {
                list.push(value);
            }
        });

        return list;
    }

    isEveryChildChecked(node) {
        return _.every(node.children, (child) => {
            if (child.children !== null) {
                return this.isEveryChildChecked(child);
            }

            return child.checked;
        });
    }

    isSomeChildChecked(node) {
        return _.some(node.children, (child) => {
            if (child.children !== null) {
                return this.isSomeChildChecked(child);
            }

            return child.checked;
        });
    }

    renderTreeNodes(nodes, parent = {}) {
        const {
            disabled,
            expandDisabled,
            noCascade,
            optimisticToggle,
            searchKeyword,
            showNodeIcon,
            collapseRenderer,
            checkboxRenderer,
            iconRenderer,
            labelRenderer
        } = this.props;
        const treeNodes = _.map(nodes, (node) => {
            const checked = this.getCheckState(node, noCascade);
            const children = this.renderChildNodes(node);
            const nodeDisabled = this.getDisabledState(node, parent, disabled, noCascade);

            return (
                <TreeNode
                    key={node.value}
                    checked={checked}
                    className={node.className}
                    disabled={nodeDisabled}
                    expandDisabled={expandDisabled}
                    expanded={node.expanded}
                    hide={node.hide}
                    icon={node.icon}
                    label={node.label}
                    node={node}
                    optimisticToggle={optimisticToggle}
                    rawChildren={node.children}
                    searchKeyword={searchKeyword}
                    showNodeIcon={showNodeIcon}
                    treeId={this.id}
                    value={node.value}
                    collapseRenderer={collapseRenderer}
                    checkboxRenderer={checkboxRenderer}
                    iconRenderer={iconRenderer}
                    labelRenderer={labelRenderer}
                    onCheck={this.handleCheck}
                    onExpand={this.handleExpand}
                >
                    {children}
                </TreeNode>
            );
        });

        return (
            <ol>
                {treeNodes}
            </ol>
        );
    }

    renderChildNodes(node) {
        if (node.children !== null && node.expanded) {
            return this.renderTreeNodes(node.children, node);
        }

        return null;
    }

    renderHiddenInput() {
        const {
            name,
            nameAsArray
        } = this.props;

        if (name === undefined) {
            return null;
        } else if (nameAsArray) {
            return this.renderArrayHiddenInput();
        } else {
            return this.renderJoinedHiddenInput();
        }
    }

    renderArrayHiddenInput() {
        const { checked } = this.props;
        return _.map(checked, (value) => {
            const name = `${this.props.name}[]`;
            return (
                <input
                    key={value}
                    name={name}
                    type='hidden'
                    value={value} />
            );
        });
    }

    renderJoinedHiddenInput() {
        const {
            checked,
            name
        } = this.props;
        return (
            <input
                name={name}
                type='hidden'
                value={checked.join(',')} />
        );
    }

    renderSearchEmpty() {
        const {
            searchEmptyRenderer,
            searchEmptyText
        } = this.props;
        let emptyText;

        if (searchEmptyRenderer) {
            emptyText = searchEmptyRenderer({
                searchEmptyText,
                element: this
            });
        } else {
            emptyText = (
                <span className='rct-empty-text'>{searchEmptyText}</span>
            )
        }

        return emptyText;
    }

    render() {
        const {
            nodes,
            disabled
        } = this.props;
        this.formattedNodes = this.getFormattedNodes(nodes);
        const showSearchEmpty = _.size(this.getShowNodes()) === 0;
        const checkboxTreeClass = classNames({
            'checkbox-tree': true,
            'rct-disabled': disabled,
            'rct-empty': showSearchEmpty
        });

        return (
            <div className={checkboxTreeClass}>
                {this.renderHiddenInput()}
                {this.renderTreeNodes(this.formattedNodes)}
                {showSearchEmpty && this.renderSearchEmpty()}
            </div>
        );
    }
}

export default CheckboxTree;
