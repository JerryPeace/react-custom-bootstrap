import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import RadioGroup from 'forms/RadioGroup';

describe('RadioGroup', () => {
    let mockChange;
    let items;
    let radios;

    describe('with props', () => {
        beforeEach(() => {
            mockChange = jest.fn();
            items = [
                {
                    labelText: 'apple',
                    value: 1
                }, {
                    labelText: 'pen',
                    value: 2
                }, {
                    labelText: 'pine apple',
                    value: 3
                }
            ];
            radios = mount(
                <RadioGroup
                    items={items}
                    onChange={mockChange}
                    selectedValue={1}
                    />
            );
        });

        test('should render corrently', () => {
            expect(toJSON(radios)).toMatchSnapshot();
            radios.instance().cleanDirty();
            expect(radios.instance().isDirty()).toBeFalsy();
            expect(radios.instance().getValue()).toBe('1');
        });

        test('check isDirty revert behavior', () => {
            radios.instance().cleanDirty();
            expect(radios.instance().isDirty()).toBeFalsy();
            radios.setProps({selectedValue: 2});
            expect(radios.instance().isDirty()).toBeTruthy();
            radios.setProps({selectedValue: 1});
            expect(radios.instance().isDirty()).toBeFalsy();
        });

        test('click input 2 would trigger callback', () => {
            radios.find({value: 2}).simulate('change');
            expect(mockChange.mock.calls.length).toBe(1);
            expect(mockChange.mock.calls[0][1]).toBe(2);
        });

        test('render correctly when selected changed', () => {
            radios.setProps({selectedValue: 2});
            expect(radios.instance().getValue()).toBe('2');
            expect(toJSON(radios)).toMatchSnapshot();
        });
    });
});
