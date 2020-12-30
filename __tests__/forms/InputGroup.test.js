import React from 'react';
import { mount } from 'enzyme';
import InputGroup from 'forms/InputGroup';
import toJSON from'enzyme-to-json';

describe('InputGroup', () => {

    let inputGroup, inst;

    describe('InputGroup', () => {

        let getValue;

        beforeEach(() => {
            getValue = jest.fn();
            inputGroup = mount(<InputGroup />);
            inst = inputGroup.instance();
        });

        test('should render corrently', () => {
            expect(toJSON(inputGroup)).toMatchSnapshot();
        });

        test('get textfield value', () => {

            const input = inputGroup.find('input');
            input.simulate('focus');
            input.simulate('change', { target: { value: 'Hello' } });
            inputGroup.update();
            expect(input.node.value).toEqual(inst.getValue());

        });
    });

    describe('with only left field', () => {

        beforeEach(() => {
            inputGroup = mount(<InputGroup leftField='left field' leftFieldType='others' />);
        });

        test('should render corrently', () => {
            expect(toJSON(inputGroup)).toMatchSnapshot();
        });

    });

    describe('with only left field (button-group)', () => {

        beforeEach(() => {
            inputGroup = mount(<InputGroup leftField='left field' leftFieldType='button-group' />);
        });

        test('should render corrently', () => {
            expect(toJSON(inputGroup)).toMatchSnapshot();
        });

    });

    describe('with only right field', () => {

        beforeEach(() => {
            inputGroup = mount(<InputGroup rightField='right field' rightFieldType='others' />);
        });

        test('should render corrently', () => {
            expect(toJSON(inputGroup)).toMatchSnapshot();
        });

    });

    describe('with only right field (button-group)', () => {

        beforeEach(() => {
            inputGroup = mount(<InputGroup rightField='right field' rightFieldType='button-group' />);
        });

        test('should render corrently', () => {
            expect(toJSON(inputGroup)).toMatchSnapshot();
        });

    });

    describe('with both left field and right field', () => {

        beforeEach(() => {
            inputGroup = mount(<InputGroup
                leftField='left field' leftFieldType='others'
                rightField='right field' rightFieldType='others' />);
        });

        test('should render corrently', () => {
            expect(toJSON(inputGroup)).toMatchSnapshot();
        });

    });

});
