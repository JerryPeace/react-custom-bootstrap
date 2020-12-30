import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '../button/Button';
import Dropdown from './Dropdown';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
const CLICK = 'click';
const HOVER = 'hover';

class ConvenientDropdown extends Component {
    static propTypes = {
        toggleEvent: PropTypes.oneOf([CLICK, HOVER]),
        activeValueDisplayRender: PropTypes.func,
        displayKey: PropTypes.string,
        displayKeys: PropTypes.array,
        options: PropTypes.array,
        togglerClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        togglerMinWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        listMaxHeight: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        listWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        listPullRight: PropTypes.bool,
        dropup: PropTypes.bool,
        togglerBsStyle: PropTypes.string,
        isCheckStyle: PropTypes.bool,
        onMenuClosed: PropTypes.func,
        onMenuOpened: PropTypes.func,
        onSelect: PropTypes.func,
        closeMenuOnSelected: PropTypes.bool,
        closeMenuOnActiveClicked: PropTypes.bool,
        optionDisplayRender: PropTypes.func,
        renderMenuItemProps: PropTypes.func,
        renderMenuProps: PropTypes.func,
        renderTogglerProps: PropTypes.func,
        togglerRender: PropTypes.func,
        renderDropdownProps: PropTypes.func,
        showCaret: PropTypes.bool,
        togglerOnlyIcon: PropTypes.bool,
        togglerTitle: PropTypes.node,
        defaultTogglerTitle: PropTypes.node,
        valueKey: PropTypes.string,
        activeValue: PropTypes.any,
        disabled: PropTypes.bool,
        style: PropTypes.object
    };

    static defaultProps = {
        toggleEvent: CLICK,
        activeValue: null,
        activeValueDisplayRender: null,
        closeMenuOnSelected: true,
        closeMenuOnActiveClicked: true,
        disabled: false,
        displayKey: 'label',
        displayKeys: ['label', 'text'],
        dropup: false,
        isCheckStyle: true,
        listMaxHeight: 200,
        listPullRight: false,
        listWidth: 'auto',
        optionDisplayRender: null,
        options: [],
        showCaret: true,
        style: {},
        togglerBsStyle: 'plain',
        togglerRender: null,
        togglerMinWidth: 80,
        togglerOnlyIcon: false,
        togglerTitle: null,
        defaultTogglerTitle: null,
        valueKey: 'value'
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.bindHandlers();
    }

    bindHandlers() {
        this.handleMenuItemSelectedChanged = ::this.handleMenuItemSelectedChanged;
        this.handleMenuToggled = ::this.handleMenuToggled;
        this.handleRootClose = ::this.handleRootClose;
        this.handleActiveClicked = this.handleMenuToggled.bind(this, false);
    }

    handleMenuToggled(open) {
        const show = _.isBoolean(open) ? open : !this.state.open;
        if (show !== this.state.open) {
            this.setState({open: show});
            if (show) {
                this.props.onMenuOpened && this.props.onMenuOpened();
            } else {
                this.props.onMenuClosed && this.props.onMenuClosed();
            }
        }
    }

    handleMenuHoverToggled() {
        return {
            onMouseOver: () => {
                if (!this.state.open) {
                    this.handleMenuToggled(true);
                }
            },
            onMouseLeave: () => {
                this.handleMenuToggled(false);
            }
        };
    }

    handleRootClose() {
        if (this.props.toggleEvent !== HOVER) {
            this.handleMenuToggled(false);
        }
    }

    handleMenuItemSelectedChanged({event, itemContent, selectData}) {
        const {
            closeMenuOnSelected,
            onSelect
        } = this.props;

        onSelect(selectData, event);
        if (closeMenuOnSelected) {
            this.handleMenuToggled(false);
        }
    }

    renderToggler() {
        const {
            toggleEvent,
            activeValue,
            activeValueDisplayRender,
            disabled,
            displayKey,
            displayKeys,
            optionDisplayRender,
            options,
            renderTogglerProps,
            showCaret,
            togglerBsStyle,
            togglerClassName,
            togglerMinWidth,
            togglerOnlyIcon,
            togglerTitle,
            togglerRender,
            defaultTogglerTitle,
            valueKey
        } = this.props;
        let renderData;
        let togglerDisplay;
        let activeValueDisplay;
        let optionIconProps = {};

        const togglerOp = _.find(options, (option) => {
            const v = option[valueKey];
            return _.isEqual(v, activeValue) || (_.isArray(v) && _.includes(v, activeValue));
        });
        if (togglerOp) {
            renderData = {
                label: togglerOp[displayKey]
                       || togglerOp[displayKeys[0]]
                       || togglerOp[displayKeys[1]],
                value: togglerOp[valueKey]
            };
            optionIconProps = {
                faStyle: togglerOp.faStyle,
                faProps: togglerOp.faProps,
                iconEl: togglerOp.iconEl
            };
        }
        if (togglerOnlyIcon) {
            optionIconProps = {
                ...optionIconProps,
                style: {}
            };
        }

        if (togglerTitle) {
            togglerDisplay = togglerTitle;
        } else {
            activeValueDisplay =  activeValueDisplayRender ? activeValueDisplayRender(renderData)
                                          : optionDisplayRender
                                            ? optionDisplayRender(renderData)
                                            : renderData && renderData.label;
            togglerDisplay = activeValueDisplay || defaultTogglerTitle;
        }

        const renderProps = renderTogglerProps ? renderTogglerProps(togglerOp) : {};
        const togglerProps = {
            bsStyle: togglerBsStyle,
            className: classNames('dropdown-toggle', togglerClassName, {
                'has-caret': showCaret,
                'only-icon': togglerOnlyIcon
            }),
            isCaretStyle: showCaret,
            disabled,
            onClick: (e) => {
                if (toggleEvent === CLICK) {
                    this.handleMenuToggled();
                }
            },
            style: {
                minWidth: togglerMinWidth
            },
            ...optionIconProps,
            ...renderProps
        }

        if (togglerRender) {
            return togglerRender({
                ...togglerProps,
                togglerDisplay
            });
        } else {
            return (
                <Button {...togglerProps} >
                    {togglerDisplay}
                </Button>
            );
        }
    }

    renderMenu() {
        const {
            isCheckStyle,
            listMaxHeight,
            listWidth,
            renderMenuProps,
            listPullRight
        } = this.props;
        const menuProps = renderMenuProps ? renderMenuProps() : {};
        const menuStyles = {
            maxHeight: listMaxHeight,
            overflowY: 'auto'
        };
        if (listWidth !== 'auto' ) {
            menuStyles.minWidth = 0;
            menuStyles.width = listWidth;
        }

        return (
            <Menu
                isMenuCheckStyle={isCheckStyle}
                style={menuStyles}
                isMenuAlignRight={listPullRight}
                onRootClose={this.handleRootClose}
                {...menuProps}
                >
                {this.renderMenuItems()}
            </Menu>
        );
    }

    renderMenuItems() {
        const {
            activeValue,
            closeMenuOnActiveClicked,
            displayKey,
            displayKeys,
            valueKey,
            options,
            optionDisplayRender,
            renderMenuItemProps
        } = this.props;

        return _.map(options, (option, idx) => {
            const {
                disabled,
                divider,
                faStyle,
                faProps,
                header,
                iconEl,
                key,
                value,
            } = option;
            const itemProps = renderMenuItemProps ? renderMenuItemProps(option, options) : {};

            if (header || _.isUndefined(option[valueKey])) {
                return (
                    <MenuItem header key={key} {...itemProps}>
                        {option[displayKey] || option[displayKeys[0]] || option[displayKeys[1]]}
                    </MenuItem>
                );
            } else if (divider) {
                return <MenuItem divider key={key} />;
            } else {
                const opVal = option[valueKey];
                const isOptionActive = _.isEqual(opVal, activeValue)
                                       || (_.isArray(opVal) && _.includes(opVal, activeValue));
                const renderData = {
                    label: option[displayKey] || option[displayKeys[0]] || option[displayKeys[1]],
                    value: opVal
                };
                const optionDisplay = optionDisplayRender ? optionDisplayRender(renderData)
                                                          : renderData.label;
                return (
                    <MenuItem
                        key={key || value}
                        active={isOptionActive}
                        disabled={disabled}
                        faStyle={faStyle}
                        faProps={faProps}
                        iconEl={iconEl}
                        selectData={opVal}
                        onSelect={this.handleMenuItemSelectedChanged}
                        onActiveClicked={closeMenuOnActiveClicked ? this.handleActiveClicked : null}
                        {...itemProps}
                        >
                        {optionDisplay}
                    </MenuItem>
                );
            }
        });
    }

    render() {
        const { open } = this.state;
        const {
            className,
            dropup,
            style,
            toggleEvent,
            renderDropdownProps
        } = this.props;

        const dropdownProps = renderDropdownProps ? renderDropdownProps() : {};
        const toggleEventProps = toggleEvent === HOVER ? this.handleMenuHoverToggled(): {};
        return (
            <Dropdown
                className={classNames(className, { dropup })}
                isMenuOpen={open}
                toggle={this.renderToggler()}
                menu={this.renderMenu()}
                style={style}
                {...toggleEventProps}
                {...dropdownProps}
                />
        );
    }
}

export default ConvenientDropdown;
