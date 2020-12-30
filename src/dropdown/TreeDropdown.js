import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import naturalSort from 'natural-sort';
import CustomPropTypes from '../utils/CustomPropTypes';
import styleMaps from '../styleMaps';
import Button from '../button/Button';
import LayoutHelper from '../forms/LayoutHelper';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import TooltipHelper from '../tooltip/TooltipHelper';
import nodeShape from '../tree/nodeShape';
import CheckboxTree from '../tree/CheckboxTree';
import Dropdown from './Dropdown';
import searchMenuHoc from './searchMenuHoc';
import toggleEventHoc from './toggleEventHoc';

const SearchableMenu = searchMenuHoc(Menu);

class TreeDropdown extends Component {
    static propTypes = {
        // menu
        isMenuOpen: PropTypes.bool,
        togglePlaceholder: PropTypes.string,
        toggleRenderer: PropTypes.func, // { element }
        toggleContentRenderer: PropTypes.func, // { checked, flattenNodes, naturalSort, togglePlaceholder, element }
        toggleTextRenderer: PropTypes.func, // { checked, flattenNodes, naturalSort, element }
        onMenuToggled: PropTypes.func,
        onRootClosed: PropTypes.func,
        // search bar
        showSearchBox: PropTypes.bool,
        searchBoxPlaceholder: PropTypes.string,
        clearFilterTextOnClose: PropTypes.bool,
        listPullRight: PropTypes.bool,
        searchEmptyText: PropTypes.string,
        searchEmptyRenderer: PropTypes.func, // { searchEmptyText, element }
        // fixed node
        fixedNodesRenderer: PropTypes.func, // { element }
        // checkbox tree
        nodes: PropTypes.arrayOf(nodeShape).isRequired,
        checked: PropTypes.arrayOf(PropTypes.string),
        expanded: PropTypes.arrayOf(PropTypes.string),
        expandAllDefault: PropTypes.bool,
        collapseRenderer: PropTypes.func, // { node, hasChildren, handleExpand, element }
        checkboxRenderer: PropTypes.func, // { node, inputId, handleCheck, element }
        iconRenderer: PropTypes.func, // { node, hasChildren, element }
        labelRenderer: PropTypes.func, // { node, searchKeyword, Highlighter, element }
        isKeywordMatch: PropTypes.func, // { node, searchKeyword }
        isNodeHide: PropTypes.func, // { node, searchKeyword }
        validator: PropTypes.func, // { element, newValue, oldValue }
        onCheck: PropTypes.func, // checked
        onExpand: PropTypes.func,
        // LayoutHelper
        helpText: PropTypes.string, // default invalid message
        bsClass: CustomPropTypes.keyOf(styleMaps.CLASSES),
        standalone: PropTypes.bool,
        labelClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        wrapperClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        helpTextClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ])
    };

    static defaultProps = {
        showSearchBox: true,
        validator: ({ element, newValue, oldValue }) => true,
        // LayoutHelper
        bsClass: 'tree-dropdown',
        standalone: true,
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        helpTextClassName: 'has-error'
    };

    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: '',
            helpText: null
        };

        this.flattenNodes = this.getFlattenNodes(props.nodes);

        this.handleHelpTextUpdate = ::this.handleHelpTextUpdate;
        this.handleCheckboxTreeCheck = ::this.handleCheckboxTreeCheck;
        this.handleSearchChange = ::this.handleSearchChange;
    }

    componentWillReceiveProps(nextProps) {
        const { nodes } = nextProps;

        if (!_.isEqual(this.props.nodes, nodes)) {
            this.flattenNodes = this.getFlattenNodes(nodes);
        }
    }

    getFlattenNodes(nodes) {
        return _.reduce(nodes, (accumulator, node) => {
            let result = {
                ...accumulator,
                [node.value]: {
                    ...node
                }
            };

            if (_.isArray(node.children) && _.size(node.children) > 0) {
                result = {
                    ...result,
                    ...this.getFlattenNodes(node.children)
                }
            }

            return result;
        }, {})
    }

    validate(checked) {
        const {
            checked: checkedProps,
            validator
        } = this.props;
        const result = validator({
            element: this,
            newValue: _.isUndefined(checked) ? checkedProps : checked,
            oldValue: checkedProps
        });

        if (_.isObject(result) && _.isFunction(result.then)) {
            return result.then(this.handleHelpTextUpdate);
        } else {
            return this.handleHelpTextUpdate(result);
        }
    }

    handleHelpTextUpdate(result) {
        let validInfo;

        if (result !== true) {
            validInfo = {
                result: false,
                helpText: _.isString(result) ? result : this.props.helpText
            };
        } else {
            validInfo = {
                result: true,
                helpText: null
            };
        }

        this.setState({
            helpText: validInfo.helpText
        });

        return validInfo;
    }

    handleCheckboxTreeCheck(checked) {
        const { onCheck } = this.props;
        onCheck && onCheck(checked);
        this.validate(checked);
    }

    handleSearchChange(value) {
        this.setState({
            searchKeyword: _.isString(value) ? value.trim() : ''
        });
    }

    renderToggleText() {
        const {
            checked,
            toggleTextRenderer
        } = this.props;
        const flattenNodes = this.flattenNodes;
        let label;

        if (toggleTextRenderer) {
            label = toggleTextRenderer({
                checked,
                flattenNodes,
                naturalSort,
                element: this
            });
        } else {
            const sortChecked = checked.sort(naturalSort({
                caseSensitive: false,
                direction: 'asc'
            }));
            label = _.map(sortChecked, (value) => flattenNodes[value].label).join(', ');
        }

        return label;
    }

    renderToggleContent() {
        const {
            checked,
            togglePlaceholder,
            toggleContentRenderer
        } = this.props;
        let toggleText;

        if (toggleContentRenderer) {
            toggleText = toggleContentRenderer({
                checked,
                naturalSort,
                togglePlaceholder,
                element: this,
                flattenNodes: this.flattenNodes
            });
        } else {
            if (_.isArray(checked) && _.size(checked) === 0) {
                toggleText = (
                    <span className='toggle-text toggle-placeholder'>{togglePlaceholder}</span>
                );
            } else {
                toggleText = (
                    <TooltipHelper
                        wrapperClassName='toggle-text'
                        ifWrapText={true}
                        tooltipMaxWidth={550} >
                        {this.renderToggleText()}
                    </TooltipHelper>
                );
            }
        }

        return toggleText;
    }

    renderToggle() {
        const {
            onMenuToggled,
            toggleRenderer
        } = this.props;
        let toggle;

        if (toggleRenderer) {
            toggle = toggleRenderer({
                onMenuToggled,
                element: this
            });
        } else {
            toggle = (
                <Button
                    className='dropdown-toggle'
                    bsStyle='plain'
                    isCaretStyle={true}
                    onClick={onMenuToggled}
                >
                    {this.renderToggleContent()}
                </Button>
            );
        }

        return toggle;
    }

    renderFixedNodes() {
        const {
            fixedNodesRenderer,
            showSearchBox
        } = this.props;
        return ((fixedNodesRenderer || showSearchBox) &&
            <div className='fixed-nodes'>
                {fixedNodesRenderer && fixedNodesRenderer({ element: this })}
                <MenuItem divider={true} />
            </div>
        )
    }

    renderCheckboxTree() {
        const {
            nodes,
            checked,
            expanded,
            expandAllDefault,
            searchEmptyText,
            collapseRenderer,
            checkboxRenderer,
            iconRenderer,
            labelRenderer,
            searchEmptyRenderer,
            onExpand
        } = this.props;

        return (
            <CheckboxTree
                nodes={nodes}
                checked={checked}
                expanded={expanded}
                expandAllDefault={expandAllDefault}
                searchEmptyText={searchEmptyText}
                searchKeyword={this.state.searchKeyword}
                collapseRenderer={collapseRenderer}
                checkboxRenderer={checkboxRenderer}
                iconRenderer={iconRenderer}
                labelRenderer={labelRenderer}
                searchEmptyRenderer={searchEmptyRenderer}
                onCheck={this.handleCheckboxTreeCheck}
                onExpand={onExpand} />
        );
    }

    renderMenu() {
        const {
            children,
            clearFilterTextOnClose,
            listPullRight,
            searchBoxPlaceholder,
            showSearchBox,
            onRootClosed
        } = this.props;
        const CustomMenu = showSearchBox ? SearchableMenu : Menu;

        return (
            <CustomMenu
                clearFilterTextOnClose={clearFilterTextOnClose}
                listPullRight={listPullRight}
                searchBoxPlaceholder={searchBoxPlaceholder}
                onRootClose={onRootClosed}
                onSearchChange={this.handleSearchChange}
            >
                {this.renderFixedNodes()}
                {this.renderCheckboxTree()}
                {children}
            </CustomMenu>
        );
    }

    renderTreeDropdown() {
        const treeDropdownClass = classNames({
            'tree-dropdown': true
        }, this.props.className);

        return (
            <Dropdown
                className={treeDropdownClass}
                isMenuOpen={this.props.isMenuOpen}
                toggle={this.renderToggle()}
                // Dropdown will pass isMenuOpen props into menu element
                menu={this.renderMenu()} />
        );
    }

    render() {
        const {
            bsClass,
            standalone,
            labelClassName,
            wrapperClassName,
            helpTextClassName
        } = this.props;

        return (
            <LayoutHelper
                bsClass={bsClass}
                standalone={standalone}
                labelClassName={labelClassName}
                wrapperClassName={wrapperClassName}
                helpTextClassName={helpTextClassName}
                FieldBase={this.renderTreeDropdown()}
                helpText={this.state.helpText} />
        );
    }
}

export default toggleEventHoc(TreeDropdown);
