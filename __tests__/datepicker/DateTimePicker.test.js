import React from 'react';
import sinon from 'sinon';
import moment from 'moment';
import {mount, shallow} from 'enzyme';
import DateTimePicker from 'datepicker/DateTimePicker';

describe('DateTimePicker', () => {
    const value = '2018-10-11 20:20:20';
    const newValue = '2018-11-12 10:10:10';
    const illegalValue = '2018-20-00 10:10:10';
    const isValidSpy = sinon.spy(DateTimePicker.prototype, 'isValid');
    const onChangeSpy = sinon.spy(DateTimePicker.prototype, 'onChange');

    test('should render correctly.', () => {
        const datepicker = shallow(
            <DateTimePicker value={value} />
        );

        expect(datepicker).toMatchSnapshot();
    });

    test('should be able to set default value.', () => {
        const datepicker = mount(<DateTimePicker defaultValue={value} />);
        const result = datepicker.node.getValue();
        expect(result).toEqual(value);
    });

    test('should be able to get date when invoking getValue method.', () => {
        const datepicker = mount(<DateTimePicker value={value} />);
        const result = datepicker.node.getValue();
        expect(result).toEqual(value);
    });

    test('should change value when invoking onChange method.', () => {
        const handleChange = (value) => {
            datepicker.setProps({ value: value });
        };

        const datepicker = mount(
            <DateTimePicker
                value={value}
                onChange={handleChange}
            />
        );

        expect(datepicker.prop('value')).toEqual(value);
        expect(onChangeSpy.callCount).toEqual(0);
        datepicker.node.onChange(newValue);
        expect(datepicker.prop('value')).toEqual(newValue);
        expect(onChangeSpy.callCount).toEqual(1);
    });

    test('should be able to validate the illegal date(string).', () => {
        const isValidDate = (currentDate) => {
            return moment(currentDate).isValid();
        };
        const datepicker = mount(
            <DateTimePicker
                value={illegalValue}
                isValidDate={isValidDate}
                validator={isValidDate}
            />
        );

        expect(isValidSpy.callCount).toEqual(0);
        expect(datepicker.node.isValid()).toEqual(false);
        expect(isValidSpy.callCount).toEqual(1);
    });

    test('should be able to validate the illegal date(moment object).', () => {
        const value = moment(illegalValue);
        const isValidDate = (currentDate) => {
            return moment(currentDate).isValid();
        };
        const datepicker = mount(
            <DateTimePicker
                value={illegalValue}
                isValidDate={isValidDate}
                validator={isValidDate}
            />
        );

        expect(isValidSpy.callCount).toEqual(1);
        expect(datepicker.node.isValid()).toEqual(false);
        expect(isValidSpy.callCount).toEqual(2);
    });
});
