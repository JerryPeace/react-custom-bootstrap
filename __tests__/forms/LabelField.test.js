import React from 'react';
import {mount} from 'enzyme';
import LabelField from 'forms/LabelField';

describe('LabelField', () => {
    let labelFeild;

    test('with default settings', () => {
        labelFeild = mount(
            <LabelField
                labelText='label text'
                value='value test'
            >
                children
            </LabelField>
        );
        expect(labelFeild).toMatchSnapshot();
    });

    test('with multiple whitespace which should be translated into (0x20, 0xa0) in bytes', () => {
        labelFeild = mount(
            <LabelField
                labelText='label text'
                value='multiple       whitespace and   second    one'
            >
                children
            </LabelField>
        );
        expect(labelFeild).toMatchSnapshot();
    });
});
