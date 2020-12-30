import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Menu from '../../menu/Menu';
import MenuItem from '../../menu/MenuItem';

const MultipleSelectionMenu = (props) => {
    const {
        className,
        displayKey,
        valueKey,
        disabled,
        onItemSelect,
        menuItems
    } = props;
    const menuItemProps = disabled ? { tabIndex: -1 } : {};
    const menuProps = disabled ? {} : { onItemSelect };

    return (
        <Menu
            className={classNames('menu', className, { disabled })}
            isMenuOpen={true}
            noRootClose={true}
            {...menuProps}
        >
            {_.map(menuItems, (selectData, index) => {
                const isGroup = selectData.isGroup;

                return (
                    <MenuItem
                        key={`${isGroup ? 'group' : 'item'}-${selectData[valueKey]}`}
                        selectData={selectData}
                        clickableHeader={isGroup}
                        {...menuItemProps}
                    >
                        {selectData[displayKey]}
                    </MenuItem>
                );
            })}
        </Menu>
    );
};

MultipleSelectionMenu.propTypes = {
    className: PropTypes.string,
    displayKey: PropTypes.string,
    valueKey: PropTypes.string,
    disabled: PropTypes.bool,
    onItemSelect: PropTypes.func,
    menuItems: PropTypes.array
};

export default MultipleSelectionMenu;
