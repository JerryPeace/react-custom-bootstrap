import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Datetime from 'react-datetime';
import moment from 'moment';
import TmIcon from '../icon/TmIcon';

class DateTimePicker extends Component {
    static propTypes = {
        // icons and format
        backLabel: PropTypes.node,
        columnOfMonth: PropTypes.number,
        dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        entryLabel: PropTypes.node,
        fullMonthLabel: PropTypes.bool,
        inputLabel: PropTypes.node,
        locale: PropTypes.string,
        minTimeGap: PropTypes.number,
        timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        timeGapUnit: PropTypes.string,
        timeToggleLabelDown: PropTypes.node,
        timeToggleLabelUp: PropTypes.node,
        weekDayDisplayMode: PropTypes.string,

        // displaying controll
        closeOnSelect: PropTypes.bool,
        closeOnTab: PropTypes.bool,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        open: PropTypes.bool,

        // methods
        isValidDate: PropTypes.func,
        renderDay: PropTypes.func,
        validator: PropTypes.func,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,

        // values
        defaultValue: PropTypes.any,
        value: PropTypes.any,
    };

    static defaultProps = {
        // icons and format
        backLabel: <TmIcon name='calendar' />,
        columnOfMonth: 3,
        dateFormat: 'YYYY-MM-DD',
        entryLabel: <TmIcon name='clock' />,
        fullMonthLabel: true,
        minTimeGap: 1,
        timeFormat: 'HH:mm:ss',
        timeGapUnit: 's',
        timeToggleLabelDown: <TmIcon name='chevron-down' />,
        timeToggleLabelUp: <TmIcon name='chevron-up' />,
        viewMode: 'days',
        weekDayDisplayMode: 'short',

        // displaying controll
        closeOnSelect: true,
        closeOnTab: true,
        disabled: false,
        inputProps: {},

        // methods
        isValidDate: (currentDate, selectedDate) => true,
        renderDay: (props, currentDate, selectedDate) => (
            <td {...props}><span {...props}>{currentDate.date()}</span></td>
        ),
    };

    constructor(props) {
        super(props);

        this.state = {
            currValue: props.defaultValue
        };

        this.bindHandlers();
    }

    bindHandlers() {
        this.getValue = ::this.getValue;
        this.isValid = ::this.isValid;
        this.isValidDate = ::this.isValidDate;
        this.isValidUTC = ::this.isValidUTC;
        this.onChange = ::this.onChange;
    }

    getValue() {
        if (this.props.value) {
            return this.props.value;
        } else {
            return this.state.currValue;
        }
    }

    isValid() {
        const selectedDate = this.getValue();
        return this.isValidDate(selectedDate) && this.props.validator(selectedDate);
    }

    isValidDate(currentDate, selectedDate) {
        if (!moment.isMoment(currentDate)) {
            currentDate = moment(currentDate);
        }

        return this.isValidUTC(currentDate) && this.props.isValidDate(currentDate, selectedDate);
    }

    isValidUTC(momentObject) {
        if (momentObject && momentObject.unix) {
            // Time should be after 1 January 1970 00:00:00 UTC
            return momentObject.unix() >= 0;
        }
        return false;
    }

    onChange(selectedDate) {
        if (!this.props.value) {
            this.setState({ currValue: selectedDate });
        }
        this.props.onChange && this.props.onChange(selectedDate);
    }

    renderInputLable() {
        // According to Picker type, different DEFAULT inputLabel is assigned.
        const { dateFormat, inputLabel } = this.props;
        if (inputLabel === undefined) {
            return dateFormat ? <TmIcon name='calendar' /> : <TmIcon name='clock' />;
        }
        return inputLabel;
    }

    render() {
        const {
            backLabel,
            className,
            closeOnSelect,
            closeOnTab,
            columnOfMonth,
            dateFormat,
            disabled,
            entryLabel,
            fullMonthLabel,
            inputProps,
            locale,
            minTimeGap,
            open,
            renderDay,
            timeFormat,
            timeGapUnit,
            timeToggleLabelDown,
            timeToggleLabelUp,
            validator,
            weekDayDisplayMode,
            onFocus
        } = this.props;

        const isDatePicker = !timeFormat;
        const isTimePicker = !dateFormat;
        const defaultClassName = className ? {} : {
            'rcb-date-picker': isDatePicker,
            'rcb-time-picker': isTimePicker
        };

        return (
            <Datetime
                ref='dateTime'
                backLabel={isTimePicker ? null : backLabel}
                className={classNames(className, defaultClassName)}
                closeOnSelect={closeOnSelect}
                closeOnTab={closeOnTab}
                columnOfMonth={columnOfMonth}
                dateFormat={dateFormat}
                disabled={disabled}
                entryLabel={entryLabel}
                fullMonthLabel={fullMonthLabel}
                inputLabel={this.renderInputLable()}
                inputProps={{...inputProps, disabled}}
                isValidDate={this.isValidDate}
                locale={locale}
                minTimeGap={minTimeGap}
                open={open}
                renderDay={renderDay}
                timeFormat={timeFormat}
                timeGapUnit={timeGapUnit}
                timeToggleLabelDown={timeToggleLabelDown}
                timeToggleLabelUp={timeToggleLabelUp}
                validator={validator}
                value={this.getValue()}
                weekDayDisplayMode={weekDayDisplayMode}
                onChange={this.onChange}
                onFocus={onFocus}
            />
        );
    }
}

export default DateTimePicker;
