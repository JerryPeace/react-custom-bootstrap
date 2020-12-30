import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Basic from 'forms/Basic';
import TextField from 'forms/TextField';

const defaultValue = 'defaultValue';
const updatedValue = 'updatedValue';

describe('Basic', () => {
    describe(':TextField with defaultValue', () => {
        let textField;
        beforeEach(() => {
            textField = mount(<TextField defaultValue={defaultValue} />);
        });
        test('default value is same of originalVal', () => {
            expect(textField.instance().originalVal).toEqual(defaultValue);
        });
        test('Should not be dirty in initial state', () => {
            expect(textField.instance().isDirty()).toBeFalsy();
        });
    });
    describe(':TextField with defaultValue after input value updated', () => {
        let textFieldComp;
        beforeEach(() => {
            const textField = mount(<TextField defaultValue={defaultValue} />);
            const input = textField.find('input').get(0);
            input.value = updatedValue;
            textFieldComp = textField.instance();
        });
        test('originalVal should not change after editing', () => {
            expect(textFieldComp.originalVal).toEqual(defaultValue);
        });
        test('Should be dirty after editing', () => {
            expect(textFieldComp.isDirty()).toBeTruthy();
        });
        test('Should not be dirty after clean dirty', () => {
            textFieldComp.cleanDirty();
            expect(textFieldComp.isDirty()).toBeFalsy();
        });
    });

    test('If disableDirtyCheck is true, Textfield will always not be dirty after editing', () =>{
        const textField = mount(
            <TextField defaultValue={defaultValue} disableDirtyCheck={true} />
        );
        const input = textField.find('input').get(0);
        input.value = updatedValue;
        expect(textField.instance().isDirty()).toBeFalsy();
    });
});
