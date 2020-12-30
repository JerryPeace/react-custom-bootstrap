import React from 'react';
import { mount } from 'enzyme';
import Loader from 'loader/Loader';
import toJSON from'enzyme-to-json';

describe('Loader', () => {

    let loader, inst;

    describe('Default Loader', () => {

        beforeEach(() => {
            loader = mount(<Loader />);
        });

        test('should render corrently', () => {
            expect(toJSON(loader)).toMatchSnapshot();
        });

    });

    describe('Loader Text', () => {

        beforeEach(() => {
            loader = mount(<Loader loaderText="Loading"/>);
        });

        test('should render corrently', () => {
            expect(toJSON(loader)).toMatchSnapshot();
        });

    });

    describe('Children Elmnt', () => {

        const childrenElmnt = <p>Loading...</p>

        beforeEach(() => {
            loader = mount(<Loader children={childrenElmnt}/>);
        });

        test('should render corrently', () => {
            expect(toJSON(loader)).toMatchSnapshot();
        });

    });
});
