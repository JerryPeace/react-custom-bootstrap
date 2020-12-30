import React from 'react';
import {mount} from 'enzyme';
import toJSON from'enzyme-to-json';
import Label from 'forms/Label';

describe('Label', () => {
    let label;

    test('with default settings', () => {
        label = mount(<Label text='label text'>children</Label>);
        expect(toJSON(label)).toMatchSnapshot();
    });

    test('with empty text', () => {
        label = mount(<Label text=''></Label>);
        expect(toJSON(label)).toMatchSnapshot();
    });

    test('with labelAlign is left', () => {
        label = mount(<Label text='label text' labelAlign='left'>children</Label>);
        expect(toJSON(label)).toMatchSnapshot();
    });
});
