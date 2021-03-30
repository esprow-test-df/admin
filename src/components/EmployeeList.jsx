import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filter, round, last, find } from 'lodash';
import DataTable from 'react-data-table-component';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { formatSeconds } from './../util';
import Button from './primitives/Button';
import Filter from './Filter';

import {
  employeesList,
  toggleEmployeeActivity,
} from '../features/employees/employeesSlice';

const moment = extendMoment(Moment);

const EmployeeList = () => {
  const dispatch = useDispatch();
  const employees = useSelector(employeesList);
  const [filterText, setFilterText] = useState('');
  const [filterRange, setFilterRange] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const range = filterRange
    ? moment().range(
        moment(filterRange.startDate).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        moment(filterRange.endDate).set({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        }),
      )
    : null;

  const filteredItems = filter(employees, (item) => {
    // if range is not specified filter by just name
    if (!range) {
      return item?.name?.toLowerCase().includes(filterText.toLowerCase());
    } else {
      // filter by name AND date range
      return (
        item?.name?.toLowerCase().includes(filterText.toLowerCase()) &&
        find(item.log, (logEntry) => range.contains(moment(logEntry.clockedIn)))
      );
    }
  });

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const handleRange = (startDate, endDate, reset = false) => {
    if (reset) {
      setFilterRange(null);
    } else {
      setFilterRange({ startDate, endDate });
    }
  };

  const columns = [
    {
      cell: (item) => {
        return (
          <Button
            small
            onClick={() => dispatch(toggleEmployeeActivity(item.id))}
          >
            {item.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Clocked in (Total)',
      selector: 'totalClockedIn',
      sortable: true,
      format: (row) => formatSeconds(row.totalClockedIn),
    },
    {
      name: 'Productive time',
      selector: 'totalProductive',
      sortable: true,
      format: (row) => formatSeconds(row.totalProductive),
    },
    {
      name: 'Unproductive time',
      selector: 'totalUnproductive',
      sortable: true,
      format: (row) => formatSeconds(row.totalUnproductive),
    },
    {
      name: 'Productiy Ratio',
      selector: 'productivityRatio',
      sortable: true,
      format: (row) => round(row.productivityRatio, 2),
    },
    {
      name: 'Last clocked in',
      selector: 'lastClockedIn',
      sortable: true,
      format: (row) => moment(last(row.log)?.clockedIn).format('DD MMM YYYY'),
    },
  ];

  return (
    <>
      <Filter
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        onRangeSelected={handleRange}
        filterText={filterText}
      />
      <DataTable
        columns={columns}
        data={filteredItems}
        noHeader
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        persistTableHead
      />
    </>
  );
};

export default EmployeeList;
