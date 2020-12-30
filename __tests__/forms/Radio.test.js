import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Radio from 'forms/Radio';
import Checkbox from 'forms/Checkbox';

describe('Radio', () => {
    let mockChange;
    let radio;
    let checkbox;
    let ins;

    describe('with default props', () => {
        beforeEach(() => {
            mockChange = jest.fn();
            radio = mount(<Radio singleCheckboxRadio={true} onChange={mockChange} />);
        });

        test('should render corrently', () => {
            expect(toJSON(radio)).toMatchSnapshot();
        });

        test('click input would trigger callback', () => {
            radio.find('input').simulate('change');
            expect(mockChange.mock.calls.length).toBe(1);
        });
    });

    describe('with checked props', () => {
        beforeEach(() => {
            mockChange = jest.fn()
            radio = mount(<Radio singleCheckboxRadio={true} onChange={mockChange} checked={false} />);
        });

        test('should render corrently', () => {
            radio.update();
            expect(toJSON(radio)).toMatchSnapshot();
        });

        test('after checked changed should render correctly', () => {
            radio.setProps({ checked: true });
            radio.update();
            expect(toJSON(radio)).toMatchSnapshot();
        });
    });

});
