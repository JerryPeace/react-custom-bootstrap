import React from 'react';
import {mount} from 'enzyme';
import Dropdown from 'dropdown/Dropdown';
import Menu from 'menu/Menu';
import MenuItem from 'menu/MenuItem';

describe('Dropdwon', () => {
    let dropdown;
    let dropdownProps;

    test('without subMenu should render correctly.', () => {
        dropdownProps = {
            menu: (
                <Menu>
                    <MenuItem>1</MenuItem>
                    <MenuItem>2</MenuItem>
                </Menu>
            ),
            toggle: 'Test'
        }
        dropdown = mount(
            <Dropdown {...dropdownProps} />
        );

        expect(dropdown).toMatchSnapshot();
    });

    test('with subMenu should render correctly.', () => {
        dropdownProps = {
            menu: (
                <Menu>
                    <MenuItem>1</MenuItem>
                    <MenuItem>2</MenuItem>
                </Menu>
            ),
            sideMenu: <div>side menu element</div>,
            toggle: 'Test'
        }
        dropdown = mount(
            <Dropdown {...dropdownProps} />
        );

        expect(dropdown).toMatchSnapshot();
    });

    test('with subMenu at left side should render correctly.', () => {
        dropdownProps = {
            isMenuOpen: true,
            isSideMenuOpen: true,
            isSideMenuOpenLeft: true,
            menu: (
                <Menu>
                    <MenuItem>1</MenuItem>
                    <MenuItem>2</MenuItem>
                </Menu>
            ),
            sideMenu: <div>side menu element</div>,
            toggle: 'Test'
        }
        dropdown = mount(
            <Dropdown {...dropdownProps} />
        );

        expect(dropdown).toMatchSnapshot();
    });
});
