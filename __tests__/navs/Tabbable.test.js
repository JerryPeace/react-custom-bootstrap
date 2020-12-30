import React from 'react';
import { mount } from 'enzyme';
import Tabbable from 'navs/Tabbable';

jest.useFakeTimers();

describe('Tabbable', () => {
    let tabbable;
    let onClickHandler;

    describe('with 3 tabs', () => {
        const items = [{
            value: 'aa',
            text: <div>aa</div>
        }, {
            href: '#bb',
            value: 'bb',
            text: <div>bb</div>
        }, {
            href: '#cc',
            value: { 'cc': 1 },
            text: <div>cc</div>
        }];

        beforeEach(() => {
            onClickHandler = jest.fn();
            tabbable = mount(
                <Tabbable activeTab='bb' items={items} onClick={onClickHandler}>
                    <div>tab aa</div>
                    <div>tab bb</div>
                    <div>tab cc</div>
                </Tabbable>
            );
        });

        test('render correctly with tabs', () => {
            expect(tabbable).toMatchSnapshot();
        });

        test('use props to switch activeTab to aa', () => {
            tabbable.setProps({ activeTab: 'aa' });
            tabbable.update();
            expect(tabbable).toMatchSnapshot();
        });

        test('click on cc to receive callback', () => {
            tabbable.find('button[href="#cc"]').simulate('click');
            expect(onClickHandler.mock.calls.length).toBe(1);
            expect(onClickHandler.mock.calls[0][0]).toEqual({ 'cc': 1 })
        });

        test('render tabbable with wrong activeTab value', () => {
            tabbable = mount(
                <Tabbable activeTab='unknown' items={items}>
                    <div>tab aa</div>
                    <div>tab bb</div>
                    <div>tab cc</div>
                </Tabbable>
            );
            expect(tabbable.find('li.active button[href="#"]').length).toBe(1);
            expect(tabbable).toMatchSnapshot();
        });
    });

    describe('without tabs', () => {
        beforeEach(() => {
            tabbable = mount(
                <Tabbable activeTab='bb' items={[]} />
            );
        });

        test('render correctly without tabs', () => {
            expect(tabbable).toMatchSnapshot();
        });
    });

    describe('with single tab', () => {
        const items = [{
            value: 'aa',
            text: <div>aa</div>
        }];

        beforeEach(() => {
            tabbable = mount(
                <Tabbable activeTab='aa' items={items}>
                    <div>aa</div>
                </Tabbable>
            );
        });

        test('render correctly with single tab', () => {
            expect(tabbable).toMatchSnapshot();
        });
    });

    describe('with bsStyleNavTabs', () => {
        const items = [{
            value: 'aa',
            text: <div>aa</div>
        }];

        beforeEach(() => {
            tabbable = mount(
                <Tabbable bsStyleNavTabs={['tabs', 'underline']} activeTab='aa' items={items}>
                    <div>aa</div>
                </Tabbable>
            );
        });

        test('with custom navtabs style, underline', () => {
            expect(tabbable.find('ul.nav.nav-tabs.underline').length).toBe(1);
        });
    });

    describe('with sub-menu', () => {
        const items = [{
            value: 'aa',
            text: <div>aa</div>
        }, {
            href: '#bb',
            value: 'bb',
            text: <div>bb</div>,
            subMenu: [{
                value: 'submenu1',
                text: <div>SUB-MENU 1</div>
            }, {
                value: 'submenu2',
                text: <div>SUB-MENU 2</div>
            }]
        }, {
            href: '#cc',
            value: { 'cc': 1 },
            text: <div>cc</div>
        }];

        let onSubMenuClickHandler;

        beforeEach(() => {
            onClickHandler = jest.fn();
            onSubMenuClickHandler = jest.fn();
            tabbable = mount(
                <Tabbable activeTab='bb' items={items} onClick={onClickHandler}
                    onSubMenuClick={onSubMenuClickHandler}>
                    <div>tab aa</div>
                    <div>tab bb</div>
                    <div>tab cc</div>
                </Tabbable>
            );
        });

        test('render submenu on tabbable', () => {
            expect(tabbable).toMatchSnapshot();
        });

        test('click icon to show submenu', () => {
            tabbable.find('.submenu .fa-angle-down').simulate('click');
            tabbable.update();
            jest.runAllTimers();
            expect(tabbable).toMatchSnapshot();
        });

        test('click submenu calls onClickHandler', () => {
            tabbable.find('.submenu .fa-angle-down').simulate('click');
            tabbable.update();
            jest.runAllTimers();
            tabbable.find('MenuItem li a').at(1).simulate('click');
            expect(onSubMenuClickHandler.mock.calls.length).toBe(1);
            expect(onSubMenuClickHandler.mock.calls[0][0]).toEqual('submenu2');
            expect(onClickHandler.mock.calls.length).toBe(0);
        });
    });
});

