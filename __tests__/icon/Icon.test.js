import React from 'react';
import { mount } from 'enzyme';
import Icon from 'icon/Icon';

describe('Icon', () => {
    test('render Icon correctly', () => {
        const icon = mount(<Icon src='ddd.jpg'/>);
        expect(icon).toMatchSnapshot();
    });
});
