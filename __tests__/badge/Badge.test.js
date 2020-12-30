import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Badge from 'badge/Badge';

describe('Badge', () => {
    test('render badge default', () => {
        const form = mount(
            <Badge>
                <div>test</div>
            </Badge>
        )
        expect(toJSON(form)).toMatchSnapshot();
    });
    test('render badge with props', () => {
        const form = mount(
            <Badge className='test_class' prop1='prop1' prop2='prop2'>
                <div>test</div>
            </Badge>
        )
        expect(toJSON(form)).toMatchSnapshot();
    });
});
