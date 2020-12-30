import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Fieldset from 'forms/Fieldset';

describe('Fieldset', () => {
    test('render fieldset correctly', () => {
        const fieldset = mount(
            <Fieldset title='test-title'>
                <div>test</div>
            </Fieldset>
        );
        expect(toJSON(fieldset)).toMatchSnapshot();
    });
});
