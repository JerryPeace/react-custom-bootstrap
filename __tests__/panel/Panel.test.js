import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import Panel from 'panel/Panel';

describe('Panel', () => {
    test('render Panel default', () => {
        const panel = mount(
            <Panel>
                <span>test</span>
            </Panel>
        );
        expect(panel).toMatchSnapshot();
    });

    test('render Panel default with header text', () => {
        const panel = mount(
            <Panel header='test header'>
                <span>test</span>
            </Panel>
        );
        expect(panel).toMatchSnapshot();
    });

    test('render Panel default with header node', () => {
        const panel = mount(
            <Panel header={(<div>HEADER</div>)}>
                <span>test</span>
            </Panel>
        );
        expect(panel).toMatchSnapshot();
    });

    test('render Panel default with footer', () => {
        const panel = mount(
            <Panel footer={(<div>FOOTER</div>)}>
                <span>test</span>
            </Panel>
        );
        expect(panel).toMatchSnapshot();
    });

    test('render Panel default with mask', () => {
        const panel = mount(
            <Panel mask>
                <span>test</span>
            </Panel>
        );
        expect(panel).toMatchSnapshot();
    });

    test('render Panel default with all', () => {
        const panel = mount(
            <Panel mask header={(<div>HEADER</div>)} footer={(<div>FOOTER</div>)}>
                <span>test</span>
            </Panel>
        );
        expect(panel).toMatchSnapshot();
    });
});
