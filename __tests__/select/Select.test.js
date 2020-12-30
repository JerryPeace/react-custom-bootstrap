import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Select from 'forms/Select';

describe('Select', () => {
    let select;

    describe('with default settiings', () => {
        beforeEach(() => {
            select = mount(
                <Select
                    items={[
                        {value: 'opt1', text: 'This is Option1'},
                        {value: 'opt2', text: 'This is Option2'},
                        {value: 'opt3', text: 'This is Option3'}
                    ]}
                    labelText={'Select:'}
                    defaultValue={'opt2'} />
            );
        });

        test('should render corrently', () => {
            expect(toJSON(select)).toMatchSnapshot();
        });

        test('can get value', () => {
            expect(select.instance().getValue()).toBe('opt2');
        });

        test('can set value by props', () => {
            select.setProps({ value: 'opt1' });
            select.update();
            expect(select.instance().getValue()).toBe('opt1');
        });

    });

    describe('with empty items', () => {
        beforeEach(() => {
            select = mount(
                <Select
                    items={[]}
                    labelText={'Select:'} />
            );
        });

        test('should render corrently', () => {
            expect(toJSON(select)).toMatchSnapshot();
        });
    });

});
