import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import BreadcrumbItem from 'breadcrumb/BreadcrumbItem';

describe('BreadcrumbItem', () => {
    test('default render', () => {
        const breadcrumb = mount(
            <BreadcrumbItem>
                <div>test</div>
            </BreadcrumbItem>
        );
        expect(toJSON(breadcrumb)).toMatchSnapshot();
    });

    test('apply bootstrap style', () => {
        const breadcrumb = mount(
            <BreadcrumbItem active={true} bsClass={'banner'} bsStyle={'info'}>
                <div>test</div>
            </BreadcrumbItem>
        );
        expect(toJSON(breadcrumb)).toMatchSnapshot();
    });
});
