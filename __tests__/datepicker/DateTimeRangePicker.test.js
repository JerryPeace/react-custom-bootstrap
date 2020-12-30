import React from 'react';
import sinon from 'sinon';
import moment from 'moment';
import {mount, shallow} from 'enzyme';
import DateTimeRangePicker from 'datepicker/DateTimeRangePicker';

describe('DateTimeRangePicker', () => {
    const fromTimeValue = moment('2018-10-11 10:10:10');
    const toTimeValue = moment('2018-10-13 10:10:10');

    test('should render correctly.', () => {
        const dateRangePicker = shallow(
            <DateTimeRangePicker
                fromTimeValue={fromTimeValue}
                toTimeValue={toTimeValue}
            />
        );

        expect(dateRangePicker).toMatchSnapshot();
    });

    test('should be able to get time pair.', () => {
        const dateRangePicker = mount(
            <DateTimeRangePicker
                fromTimeValue={fromTimeValue}
                toTimeValue={toTimeValue}
            />
        );

        const timePairValue = dateRangePicker.node.getValue();
        expect(dateRangePicker.prop('fromTimeValue').isSame(timePairValue.from)).toEqual(true);
        expect(dateRangePicker.prop('toTimeValue').isSame(timePairValue.to)).toEqual(true);
    });

    describe('should be able to change date.', () => {
        let dateRangePicker, onRangeChange;
        const handleDateTimeChangedSpy = sinon.spy(DateTimeRangePicker.prototype, 'handleChanged');

        beforeEach(() => {
            onRangeChange = (fromTime, toTime) => {
                dateRangePicker.setProps({
                    fromTimeValue: moment(fromTime),
                    toTimeValue: moment(toTime)
                });
            };

            dateRangePicker = mount(
                <DateTimeRangePicker
                    fromTimeValue={fromTimeValue}
                    toTimeValue={toTimeValue}
                    onRangeChange={onRangeChange}
                />
            );
        });

        test('changing fromTime calendar.', () => {
            const newfromTimeValue = moment('2018-10-10 20:20:20');

            expect(dateRangePicker.prop('fromTimeValue').isSame(fromTimeValue)).toEqual(true);
            expect(handleDateTimeChangedSpy.callCount).toEqual(0);
            dateRangePicker.node.handleChanged(newfromTimeValue, toTimeValue);
            expect(dateRangePicker.prop('fromTimeValue').isSame(newfromTimeValue)).toEqual(true);
            expect(handleDateTimeChangedSpy.callCount).toEqual(1);
        });

        test('changing toTime calendar.', () => {
            const newToTimeValue = moment('2018-10-20 20:20:20');

            expect(dateRangePicker.prop('toTimeValue').isSame(toTimeValue)).toEqual(true);
            expect(handleDateTimeChangedSpy.callCount).toEqual(1);
            dateRangePicker.node.handleChanged(fromTimeValue, newToTimeValue);
            expect(dateRangePicker.prop('toTimeValue').isSame(newToTimeValue)).toEqual(true);
            expect(handleDateTimeChangedSpy.callCount).toEqual(2);
        });
    });

    describe('should be able to validate time range.', () => {
        const LIMIT_HOURS = 6;

        test('with valid time range.', () => {
            const validTimeRange = {
                from: moment('2018-10-11 10:00:00'),
                to: moment('2018-10-11 14:00:00')
            };
            const dateRangePicker = mount(
                <DateTimeRangePicker
                    fromTimeValue={validTimeRange.from}
                    toTimeValue={validTimeRange.to}
                    limitRange={LIMIT_HOURS * 60 * 60}
                />
            );

            const isValidRange = dateRangePicker.node.isValid();
            expect(isValidRange).toEqual(true);
        });

        test('with invalid time range.', () => {
            const invalidTimeRange = {
                from: moment('2018-10-11 10:00:00'),
                to: moment('2018-10-11 20:00:00')
            };

            const dateRangePicker = mount(
                <DateTimeRangePicker
                    fromTimeValue={invalidTimeRange.from}
                    toTimeValue={invalidTimeRange.to}
                    limitRange={LIMIT_HOURS * 60 * 60}
                />
            );

            const isValidRange = dateRangePicker.node.isValid();
            expect(isValidRange).toEqual(false);
        });
    });
});
