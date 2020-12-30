import React from 'react';
import { mount } from 'enzyme';
import Glyphicon from 'glyphicon/Glyphicon';

describe('Glyphicon', () => {
    test('render glyphicon correctly', () => {
        const glyphicon = mount(<Glyphicon/>);
        expect(glyphicon).toMatchSnapshot();
    });
});
