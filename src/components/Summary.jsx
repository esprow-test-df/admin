import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { formatSeconds } from './../util';
import Button from './primitives/Button';
import Row from './primitives/Row';
import Card from './primitives/Card';

import {
  allEmployees,
  summaryData,
  displayInactive,
  fetchData,
  toggleInactive,
} from '../features/employees/employeesSlice';

const SummaryWrapper = styled.div`
  padding: 20px;
`;

function Summary() {
  const employees = useSelector(allEmployees);
  const summary = useSelector(summaryData);
  const isInactive = useSelector(displayInactive);
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchData()), [dispatch]);

  return (
    <SummaryWrapper>
      <h2>Summary</h2>
      <p>
        Displaying only <strong>{isInactive ? 'inactive' : 'active'}</strong>{' '}
        employees data.
      </p>
      <p>
        <Button
          small
          onClick={() => {
            dispatch(toggleInactive());
          }}
        >
          Show {!isInactive ? 'inactive' : 'active'}
        </Button>
      </p>
      {!employees.length ? (
        <p>Loading...</p>
      ) : (
        <Row>
          <Card
            heading={employees.length}
            text={`Employees (${summary.inactiveCount} inactive)`}
          />
          <Card
            heading={formatSeconds(summary.totalClockedIn)}
            text="Total clocked in time"
          />
          <Card
            heading={formatSeconds(summary.totalActive)}
            text="Total productive time"
          />
          <Card
            heading={formatSeconds(summary.totalInactive)}
            text="Total unproductive time"
          />
        </Row>
      )}
    </SummaryWrapper>
  );
}

export default Summary;
