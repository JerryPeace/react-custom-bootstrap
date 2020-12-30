import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import FormControls from 'forms/FormControls';

describe('FormControls', () => {
    test('render form controls correctly', () => {
        const form = mount(
            <FormControls>
                <div>test</div>
            </FormControls>
        )
        expect(toJSON(form)).toMatchSnapshot();
    });
});
