import React from 'react';
import { mount } from 'enzyme';
import Menu from 'menu/Menu';
import MenuItem from 'menu/MenuItem';

describe('Menu', () => {
    test('render Menu correctly', () => {
        const menu = mount(
            <Menu>
                <MenuItem header={true}>Menu Header</MenuItem>
                <MenuItem selectData='A'>Menu Enabled</MenuItem>
                <MenuItem divider={true}>Menu Disabled</MenuItem>
                <MenuItem selectData='B' disabled={true}>Menu Disabled</MenuItem>
                <div>simple component</div>
            </Menu>
        );
        expect(menu).toMatchSnapshot();
    });

    test('render Menu - sideMenu correctly', () => {
        const menu = mount(
            <Menu sideMenu={true}>
                <MenuItem header={true}>Menu Header</MenuItem>
                <MenuItem selectData='A'>Menu Enabled</MenuItem>
                <MenuItem divider={true}>Menu Disabled</MenuItem>
                <MenuItem selectData='B' disabled={true}>Menu Disabled</MenuItem>
                <div>simple component</div>
            </Menu>
        );
        expect(menu).toMatchSnapshot();
    });

    test('render Menu - subMenu correctly', () => {
        const menu = mount(
            <Menu subMenu={true}>
                <MenuItem header={true}>Menu Header</MenuItem>
                <MenuItem selectData='A'>Menu Enabled</MenuItem>
                <MenuItem divider={true}>Menu Disabled</MenuItem>
                <MenuItem selectData='B' disabled={true}>Menu Disabled</MenuItem>
                <div>simple component</div>
            </Menu>
        );
        expect(menu).toMatchSnapshot();
    });
});
