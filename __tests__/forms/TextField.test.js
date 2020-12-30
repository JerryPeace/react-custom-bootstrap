import React from 'react';
import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import TextField from 'forms/TextField';

jest.useFakeTimers();

describe('TextField', () => {
    let textField;

    describe('with default settings', () => {
        test('should render corrently', () => {
            textField = mount(<TextField defaultValue='test' />);
            expect(textField).toMatchSnapshot();
        });
    });

    describe('test getValue function', () => {
        test('should get same value after input given value', () => {
            const testStr = 'test';
            textField = mount(<TextField value={testStr} />).instance();
            expect(textField.getValue()).toEqual(testStr);
        });
    });

    describe('test validator function', () => {
        test('should get correct dom after invalid', () => {
            textField = mount(
                <TextField validator={(me, value) => {
                    return 'this is invalid';
                }} />
            );
            textField.find('input').simulate('change');
            jest.runAllTimers();
            textField.update();
            expect(textField).toMatchSnapshot();
        });
    });

    describe('test isValid function', () => {
        test('should get true after valid', () => {
            const testStr = 'test';
            textField = mount(
                <TextField value={testStr} validator={(me, value) => {
                    return value === testStr;
                }} />
            ).instance();
            expect(textField.isValid()).toBeTruthy();
        });

        test('should get false after invalid', () => {
            const testStr = 'test';
            textField = mount(
                <TextField value={testStr} validator={(me, value) => {
                    return value === 'invalid test';
                }} />
            ).instance();
            expect(textField.isValid()).toBeFalsy();
        });
    });

    describe('test validate function', () => {
        test('should get true after valid', () => {
            const testStr = 'test';
            textField = mount(
                <TextField value={testStr} validator={(me, value) => {
                    return value === testStr;
                }} />
            ).instance();
            expect(textField.validate().result).toBeTruthy();
        });

        test('should get false after invalid', () => {
            const testStr = 'test';
            textField = mount(
                <TextField value={testStr} validator={(me, value) => {
                    return value === 'invalid test';
                }} />
            ).instance();
            expect(textField.validate().result).toBeFalsy();
        });
    });

    describe('test default validator function', () => {
        test('should get true after default validator called', () => {
            textField = mount(<TextField />).instance();
            expect(textField.isValid()).toBeTruthy();
        });
    });

    describe('test mark and clear invalid function', () => {
        test('should get correct helptext dom after function called', () => {
            textField = mount(<TextField />);
            textField.instance().markInvalidText('test');
            textField.update();
            expect(textField).toMatchSnapshot();
            textField.instance().clearInvalidText();
            textField.update();
            expect(textField).toMatchSnapshot();
        });
    });

    describe('test helptext prop', () => {
        test('should render helptext corrently', () => {
            textField = mount(<TextField helptext='test' />);
            expect(textField).toMatchSnapshot();
        });
    });

    describe('test _onChange function', () => {
        test('prop onChange should be called', () => {
            const testValue = 'test';
            let value;
            textField = mount(
                <TextField onChange={(e) => {
                    value = 'test';
                }} />
            ).instance();
            textField._onChange();
            expect(testValue === value).toBeTruthy();
        });

        test('prop onValueChange should be called', () => {
            const testValue = 'test';
            let value;
            textField = mount(
                <TextField onValueChange={(e) => {
                    value = 'test';
                }} />
            ).instance();
            textField._onChange();
            expect(testValue === value).toBeTruthy();
        });
    });
});
