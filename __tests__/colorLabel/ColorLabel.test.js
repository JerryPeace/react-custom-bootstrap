import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import ColorLabel from 'colorLabel/index';

describe('ColorLabel', () => {
    test('render productLogo correctly', () => {
        const colorLabel = mount(
            <ColorLabel>
                <div>test</div>
            </ColorLabel>
        );
        expect(toJSON(colorLabel)).toMatchSnapshot();
    });
});
