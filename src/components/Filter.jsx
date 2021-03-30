import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Row from './primitives/Row';
import TextInput from './primitives/TextInput';
import Button from './primitives/Button';

import 'react-datepicker/dist/react-datepicker.css';

const Filter = ({ filterText, onFilter, onClear, onRangeSelected }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (end) {
      setCalendarOpen(false);
      onRangeSelected(start, end, false);
    }
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button inline onClick={onClick} ref={ref}>
      {endDate
        ? `${moment(startDate).format('DD MMM YY')} - ${moment(endDate).format(
            'DD MMM YY',
          )}`
        : 'Select date range'}
    </Button>
  ));

  return (
    <>
      <Row>
        <span style={{ margin: '15px 10px' }}>Filter by date:</span>
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          customInput={<CustomInput />}
          selectsRange
          onClickOutside={() => setCalendarOpen(false)}
          open={isCalendarOpen}
          onInputClick={() => setCalendarOpen(!isCalendarOpen)}
        />
        <Button
          inline
          onClick={() => {
            onChange([null, null]);
            onRangeSelected(null, null, true);
          }}
        >
          Reset
        </Button>
      </Row>
      <Row>
        <Button
          inline
          onClick={() => {
            setStartDate(new Date());
            setEndDate(new Date());
            onRangeSelected(new Date(), new Date());
          }}
        >
          Today
        </Button>

        <Button
          inline
          onClick={() => {
            const start = moment().subtract(1, 'day').toDate();
            const end = moment().subtract(1, 'day').toDate();
            setStartDate(start);
            setEndDate(end);
            onRangeSelected(start, end);
          }}
        >
          Yesterday
        </Button>

        <Button
          inline
          onClick={() => {
            const start = moment().subtract(7, 'day').toDate();
            setStartDate(start);
            setEndDate(new Date());
            onRangeSelected(start, new Date());
          }}
        >
          Last 7 days
        </Button>

        <Button
          inline
          onClick={() => {
            const start = moment()
              .subtract(1, 'week')
              .startOf('isoWeek')
              .toDate();
            const end = moment().subtract(1, 'week').endOf('isoWeek').toDate();
            setStartDate(start);
            setEndDate(end);
            onRangeSelected(start, end);
          }}
        >
          Last week
        </Button>

        <Button
          inline
          onClick={() => {
            const today = moment();
            const start = today.startOf('week').toDate();
            const end = new Date();
            setStartDate(start);
            setEndDate(end);
            onRangeSelected(start, end);
          }}
        >
          This week
        </Button>

        <Button
          inline
          onClick={() => {
            const today = moment();
            const start = today.startOf('month').toDate();
            const end = new Date();
            setStartDate(start);
            setEndDate(end);
            onRangeSelected(start, end);
          }}
        >
          This month
        </Button>
      </Row>
      <hr color="#CECECE" />
      <Row>
        <TextInput
          id="employeeNameSearch"
          type="text"
          placeholder="Filter By Name"
          aria-label="Search Input"
          value={filterText}
          onChange={onFilter}
        />
        <Button inline onClick={onClear}>
          Clear
        </Button>
      </Row>
    </>
  );
};

export default Filter;
