import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Breadcrumb from 'breadcrumb/Breadcrumb';

describe('Breadcrumb', () => {
    describe('No help button', () => {
        test('default render', () => {
            const breadcrumb = mount(
                <Breadcrumb>
                    <div>test</div>
                </Breadcrumb>
            );
            expect(toJSON(breadcrumb)).toMatchSnapshot();
        });
    });
    describe('Show help button', () => {
        let mockFunc;
        let breadcrumb;

        beforeEach(() => {
            mockFunc = jest.fn();
            breadcrumb = mount(
                <Breadcrumb hasHelp={true} onClickHelp={mockFunc}>
                    <div>test</div>
                </Breadcrumb>
            );
        });
        test('default render', () => {
            expect(toJSON(breadcrumb)).toMatchSnapshot();
        });
        test('click help button', () => {
            breadcrumb.find('li').simulate('click');
            expect(mockFunc.mock.calls.length).toBe(1);
        });
    });
});
