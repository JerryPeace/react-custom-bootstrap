import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import CollapsiblePanel from 'panel/CollapsiblePanel';
import styleMaps from 'styleMaps';

describe('CollapsiblePanel', () => {
    test('render CollapsiblePanel default', () => {
        const collapsible = mount(
            <CollapsiblePanel titleText='test-title'>
                <div>test</div>
            </CollapsiblePanel>
        );
        expect(collapsible).toMatchSnapshot();
    });

    test('click on header', () => {
        const collapsible = mount(
            <CollapsiblePanel titleText='test-title'>
                <div>test</div>
            </CollapsiblePanel>
        );

        collapsible.find(`.${styleMaps.CLASSES.collapse}-header`).at(0).simulate('click');
        collapsible.update();
        expect(collapsible).toMatchSnapshot();
    });

    test('click on header text', () => {
        const collapsible = mount(
            <CollapsiblePanel titleText='test-title'>
                <div>test</div>
            </CollapsiblePanel>
        );

        collapsible.find(`.${styleMaps.CLASSES.collapse}-header-text`).at(0).simulate('click');
        collapsible.update();
        expect(collapsible).toMatchSnapshot();
    });

    test('click on header arrow', () => {
        const collapsible = mount(
            <CollapsiblePanel titleText='test-title'>
                <div>test</div>
            </CollapsiblePanel>
        );

        collapsible.find(`.${styleMaps.CLASSES.collapse}-header-arrow-icon`).at(0).simulate('click');
        collapsible.update();
        expect(collapsible).toMatchSnapshot();
    });

    test('click on header close by clicking on arrow and open on text', () => {
        const collapsible = mount(
            <CollapsiblePanel titleText='test-title'>
                <div>test</div>
            </CollapsiblePanel>
        );
        // close panel by clicking on arrow
        collapsible.find(`.${styleMaps.CLASSES.collapse}-header-arrow-icon`).at(0).simulate('click');
        collapsible.update();
        expect(collapsible.state('in')).toBeFalsy();
        expect(collapsible).toMatchSnapshot();
        // open panel by clicking on text
        collapsible.find(`.${styleMaps.CLASSES.collapse}-header-text`).at(0).simulate('click');
        collapsible.update();
        expect(collapsible.state('in')).toBeTruthy();
        expect(collapsible).toMatchSnapshot();
    });
});
