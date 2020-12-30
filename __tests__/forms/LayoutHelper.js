import React from 'react';
import {mount} from 'enzyme';
import TextField from 'forms/TextField';
import LayoutHelper from 'forms/TextField';
import Checkbox from 'forms/Checkbox';
import Radio from 'forms/Radio';
import RadioGroup from 'forms/RadioGroup';
import CheckboxGroup from 'forms/CheckboxGroup';
import Button from 'button/Button';

describe('LayoutHelper', () => {
    test('should render react element label correctly', () => {
        const textField = mount(<TextField labelText={<div>test</div>} />);
        expect(textField).toMatchSnapshot();
    });

    test('should render textField with standalone false correctly', () => {
        const textField = mount(<TextField standalone={false} labelText='test' />);
        expect(textField).toMatchSnapshot();
    });

    test('should disable helptext with given displayHelpText false', () => {
        const textField = mount(<TextField displayHelpText={false} labelText='test' />);
        expect(textField).toMatchSnapshot();
    });

    test('should render customize helptext component', () => {
        const textField = mount(<TextField labelText='test' helpTextComponent={<div>this is error</div>} />);
        expect(textField).toMatchSnapshot();
    });

    test('should render tooltip props for textField', () => {
        const textField = mount(<TextField tooltipProps={{
            placement: 'top-left',
            mode: 'popover',
            tooltipValue: 'test'
        }} />);
        expect(textField).toMatchSnapshot();
    })

    test('should render Checkbox correctly', () => {
        const checkbox = mount(<Checkbox labelText='test' standalone={false} />);
        expect(checkbox).toMatchSnapshot();

        const checkboxWithStandalone = mount(<Checkbox labelText='test' standalone={true} />);
        expect(checkboxWithStandalone).toMatchSnapshot();
    });

    test('should render Radio correctly', () => {
        const radio = mount(<Radio labelText='test' standalone={false} />);
        expect(radio).toMatchSnapshot();

        const radioWithStandalone = mount(<Radio labelText='test' standalone={true} />);
        expect(radioWithStandalone).toMatchSnapshot();
    });

    test('should render checkbox/radio group with standalone correctly', () => {
        const radiogGroup1 = mount(
            <RadioGroup
                standalone={true}
                items={[
                    {value: 'opt1', labelText: 'radio group 1-1', name: 'radioGroup'},
                    {value: 'opt2', labelText: 'radio group 1-2', name: 'radioGroup'},
                    {value: 'opt3', labelText: 'radio group 1-3', name: 'radioGroup'}
                ]} />
        );
        expect(radiogGroup1).toMatchSnapshot();

        const checkboxGroup1 = mount(
            <CheckboxGroup
                standalone={true}
                items={[
                    {labelText: 'Checkbox group 1-1', value: 'ckboxgrp21'},
                    {labelText: 'Checkbox group 1-2', value: 'ckboxgrp22'},
                    {labelText: 'Checkbox group 1-3', value: 'ckboxgrp23'}
                ]} />
        );
        expect(checkboxGroup1).toMatchSnapshot();

        const checkboxGroup2 = mount(
            <CheckboxGroup
                standalone={false}
                items={[
                    {labelText: 'Checkbox group 1-1', value: 'ckboxgrp21'},
                    {labelText: 'Checkbox group 1-2', value: 'ckboxgrp22'},
                    {labelText: 'Checkbox group 1-3', value: 'ckboxgrp23'}
                ]} />
        );
        expect(checkboxGroup2).toMatchSnapshot();
    });
});
