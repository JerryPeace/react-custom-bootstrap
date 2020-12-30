import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import DateTimePicker from './DateTimePicker';

class DateTimeRangePicker extends Component {
    static propTypes = {
        // fromTime and toTime setting
        fromTimeValue: PropTypes.any,
        fromTimeInputLabel: PropTypes.node,
        toTimeValue: PropTypes.any,
        toTimeInputLabel: PropTypes.node,
        limitRange: PropTypes.number, // unit: sec

        // icons and format
        className: PropTypes.string,
        dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
        fullMonthLabel: PropTypes.bool,
        minTimeGap: PropTypes.number,
        timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
        timeGapUnit: PropTypes.string,

        // methods
        onRangeChange: PropTypes.func,
    };

    static defaultProps = {
        fromTimeValue: moment(),
        fromTimeInputLabel: 'From',
        toTimeValue: moment().add(6, 'days'),
        toTimeInputLabel: 'To',

        dateFormat: 'YYYY-MM-DD',
        fullMonthLabel: true,
        minTimeGap: 1,
        timeFormat: 'HH:mm:ss',
        timeGapUnit: 's',

        onRangeChange: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            fromTimeValue: '',
            toTimeValue: ''
        };

        const { dateFormat, timeFormat } = props;
        this.dateTimeFormat = `${dateFormat} ${timeFormat}`;
        this.bindHandlers();
    }

    componentWillReceiveProps(nextProps) {
        const { dateTimeFormat } = this;
        const newFrom = this.getMoment(nextProps.fromTimeValue);
        const newTo = this.getMoment(nextProps.toTimeValue);
        const oldFrom = this.getMoment(this.props.fromTimeValue);
        const oldTo = this.getMoment(this.props.toTimeValue);
        // sync fromTime and toTime state to align props,
        // when only change via props.
        if (!newFrom.isSame(oldFrom) || !newTo.isSame(oldTo)) {
            const {fromTimeValue, toTimeValue} = this.state;
            if (oldFrom.format(dateTimeFormat) === fromTimeValue ||
                oldTo.format(dateTimeFormat) === toTimeValue) {
                this.handleChanged(newFrom, newTo, false);
            }
        }
    }

    bindHandlers() {
        this.getMoment = ::this.getMoment;
        this.getValue = ::this.getValue;
        this.isValidRange = ::this.isValidRange;
        this.isValid = ::this.isValid;
        this.isValidCustomRange = ::this.isValidCustomRange;
        this.handleFromChanged = ::this.handleFromChanged;
        this.handleToChanged = ::this.handleToChanged;
        this.handleChanged = ::this.handleChanged;
        this.isValidToDate = ::this.isValidToDate;
    }

    getMoment(dateTime) {
        return moment(dateTime, this.dateTimeFormat);
    }

    getValue() {
        const { getMoment } = this;
        const stateFromTime = getMoment(this.state.fromTimeValue);
        const stateToTime = getMoment(this.state.toTimeValue);
        const propFromTime = getMoment(this.props.fromTimeValue);
        const propToTime = getMoment(this.props.toTimeValue);

        return {
            from: stateFromTime.isValid() ? stateFromTime : propFromTime,
            to: stateToTime.isValid() ? stateToTime : propToTime
        };
    }

    isValid() {
        const value = this.getValue();
        const isValidFromTime = value.from.isValid();
        const isValidToTime = value.to.isValid();

        return (
            isValidFromTime &&
            isValidToTime &&
            this.isValidRange(value.from, value.to) &&
            this.isValidCustomRange(value.from, value.to)
        );
    }

    isValidRange(momentFromDate, momentToDate) {
        return momentFromDate.isBefore(momentToDate);
    }

    isValidCustomRange(fromTime, toTime) {
        const { limitRange, timeGapUnit } = this.props;
        if (!limitRange) {
            return true;
        }
        return moment(toTime).isBefore(moment(fromTime).add(limitRange, timeGapUnit));
    }

    handleFromChanged(momentFromDate) {
        if (!moment.isMoment(momentFromDate)) {
            return;
        }
        const momentToDate = this.getValue().to;
        this.handleChanged(momentFromDate, momentToDate);
    }

    handleToChanged(momentToDate) {
        if (!moment.isMoment(momentToDate)) {
            return;
        }
        const momentFromDate = this.getValue().from;
        this.handleChanged(momentFromDate, momentToDate);
    }

    handleChanged(momentFromDate, momentToDate, shouldUpdateProps = true) {
        const {
            limitRange,
            minTimeGap,
            timeGapUnit,
            onRangeChange
        } = this.props;
        const { dateTimeFormat, isValidRange, isValidCustomRange } = this;

        const fromTime = momentFromDate.format(dateTimeFormat);
        const minTime = this.getMoment(fromTime).add(minTimeGap, timeGapUnit);

        let toTime = isValidRange(momentFromDate, momentToDate)
            ? momentToDate.format(dateTimeFormat)
            : minTime.format(dateTimeFormat);

        if (limitRange) {
            const maxTime = this.getMoment(fromTime).add(limitRange - 1, timeGapUnit);
            toTime = isValidCustomRange(momentFromDate, momentToDate)
                ? toTime : maxTime.format(dateTimeFormat);
        }

        shouldUpdateProps && onRangeChange(fromTime, toTime);
        this.setState({
            fromTimeValue: fromTime,
            toTimeValue: toTime
        });
    }

    isValidToDate (momentToDate) {
        const momentFromDate = this.getValue().from;
        const isValidRange = momentFromDate.isBefore(moment(momentToDate).add(1, 'd'));

        if (this.props.limitRange) {
            return isValidRange && this.isValidCustomRange(momentFromDate, momentToDate);
        } else {
            return isValidRange;
        }
    }

    render() {
        const {
            className,
            dateFormat,
            fromTimeInputLabel,
            fullMonthLabel,
            minTimeGap,
            timeFormat,
            timeGapUnit,
            toTimeInputLabel,
        } = this.props;
        const { dateTimeFormat, getValue, isValidToDate } = this;

        const fromTime = getValue().from.format(dateTimeFormat);
        const toTime = getValue().to.format(dateTimeFormat);

        return (
            <div className={classNames('rcb-datetime-range-picker', className)}>
                <div className='from'>
                    <DateTimePicker
                        closeOnSelect={false}
                        closeOnTab={false}
                        dateFormat={dateFormat}
                        fullMonthLabel={fullMonthLabel}
                        inputLabel={fromTimeInputLabel}
                        minTimeGap={minTimeGap}
                        open={true}
                        timeFormat={timeFormat}
                        timeGapUnit={timeGapUnit}
                        value={fromTime}
                        onChange={this.handleFromChanged}
                    />
                </div>
                <div className='to'>
                    <DateTimePicker
                        closeOnSelect={false}
                        closeOnTab={false}
                        dateFormat={dateFormat}
                        fullMonthLabel={fullMonthLabel}
                        inputLabel={toTimeInputLabel}
                        isValidDate={isValidToDate}
                        minTimeGap={minTimeGap}
                        open={true}
                        timeFormat={timeFormat}
                        timeGapUnit={timeGapUnit}
                        value={toTime}
                        onChange={this.handleToChanged}
                    />
                </div>
            </div>
        );
    }
}

export default DateTimeRangePicker;
