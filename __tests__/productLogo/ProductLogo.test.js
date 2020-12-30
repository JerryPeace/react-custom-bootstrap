import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import ProductLogo from 'productLogo/ProductLogo';

describe('ProductLogo', () => {
    test('render productLogo correctly', () => {
        const productLogo = mount(<ProductLogo bsClass='ddd'/>);
        expect(toJSON(productLogo)).toMatchSnapshot();
    });
});
