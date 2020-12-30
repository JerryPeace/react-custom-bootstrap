import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Mask from 'mask/Mask';

describe('Mask', () => {
    test('render Mask correctly', () => {
        const mask = mount(<Mask isLoading={true}/>);
        expect(toJSON(mask)).toMatchSnapshot();
    });

    test('render Mask without show correctly', () => {
        const mask = mount(<Mask show={false}/>);
        expect(toJSON(mask)).toMatchSnapshot();
    });

    test('render Mask without isLoading correctly', () => {
        const mask = mount(<Mask isLoading={false}/>);
        expect(toJSON(mask)).toMatchSnapshot();
    });

    test('render Mask with loaderProps correctly', () => {
        const mask = mount(<Mask isLoading={true} loaderProps={{ className: 'test-className' }}/>);
        expect(toJSON(mask)).toMatchSnapshot();
    });
});

