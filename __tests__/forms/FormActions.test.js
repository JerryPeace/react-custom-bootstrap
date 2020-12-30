import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import FormActions from 'forms/FormActions';

describe('FormActions', () => {
    test('render form correctly', () => {
        const form = mount(
            <FormActions>
                <div>test</div>
            </FormActions>
        )
        expect(toJSON(form)).toMatchSnapshot();
    });
});
