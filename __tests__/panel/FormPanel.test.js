import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import FormPanel from 'panel/FormPanel';

describe('FormPanel', () => {
    test('render FormPanel default', () => {
        const DummyComp = (props) => {
            expect(props.standalone).toBeFalsy();
            return <span>{props.children}</span>;
        };

        const form = mount(
            <FormPanel>
                <DummyComp>test</DummyComp>
            </FormPanel>
        );
        expect(form).toMatchSnapshot();
    });

    test('render FormPanel without itemsConfig', () => {
        const form = mount(
            <FormPanel itemsConfig={null}>
                <span>test</span>
            </FormPanel>
        );
        expect(form).toMatchSnapshot();
    });

    test('renderFormPanel with custom itemsConfig', () => {
        const itemsConfig = { a: 1, b: 'b', c: true };

        const DummyComp = (props) => {
            console.log('props', props);
            _.each(itemsConfig, (v, k) => {
                expect(props[k]).toBe(v);
            });
            return <span>{props.children}</span>;
        };

        const form = mount(
            <FormPanel itemsConfig={itemsConfig}>
                <DummyComp>test</DummyComp>
            </FormPanel>
        );
        expect(form).toMatchSnapshot();
    });
});
