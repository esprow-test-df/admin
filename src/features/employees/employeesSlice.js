import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { filter, forEach } from 'lodash';

/***
 * Returns the summary object with times caluculated from the array of employees
 * @param {Array} emplyees - array of employees to get the summary for
 * @param {Boolean} displayInactive - a boolean that indicates to caluclate only the incative emplyees data
 *
 * @returns - an object contatining all the times calulcated
 */
const getSummary = (employees, displayInactive = false) => {
  if (!employees || !employees.length) {
    return;
  }
  return employees?.reduce(
    (prev, curr) => {
      let totalClockedIn = prev.totalClockedIn;
      let totalInactive = prev.totalInactive;
      let totalActive = prev.totalActive;
      if (curr.isActive === displayInactive) {
        return {
          ...prev,
          inactiveCount: curr.isActive
            ? prev.inactiveCount
            : prev.inactiveCount + 1,
        };
      }
      forEach(curr.log, (log) => {
        const clockedTime = moment(log.clockedOut).diff(
          moment(log.clockedIn),
          'seconds',
        );

        totalClockedIn += clockedTime;
        totalInactive += log.inactiveTime;
        totalActive += clockedTime - log.inactiveTime;
      });
      return {
        totalClockedIn,
        totalInactive,
        totalActive,
        inactiveCount: curr.isActive
          ? prev.inactiveCount
          : prev.inactiveCount + 1,
      };
    },
    { totalClockedIn: 0, totalInactive: 0, totalActive: 0, inactiveCount: 0 },
  );
};

/***
 * Prepares the data for the employees list with all the data calculated per eomployee
 * @param {Array} emplyees - array of employees
 * @param {Boolean} displayInactive - a boolean that indicates to caluclate only the incative emplyees data
 *
 * @returns - an array of employee objects with all of the data calculated per employee
 */
const prepareEmployeesList = (employees, displayInactive = false) => {
  return employees?.map((employee) => {
    const employeeTotals = employee.log.reduce(
      (prev, curr) => {
        const clockedTime = moment(curr.clockedOut).diff(
          moment(curr.clockedIn),
          'seconds',
        );
        const totalProductive =
          prev.totalProductive + clockedTime - curr.inactiveTime;
        const totalUnproductive = prev.totalUnproductive + curr.inactiveTime;
        return {
          totalClockedIn: prev.totalClockedIn + clockedTime,
          totalProductive,
          totalUnproductive,
          productivityRatio: totalProductive / totalUnproductive,
        };
      },
      {
        totalClockedIn: 0,
        totalProductive: 0,
        totalUnproductive: 0,
        productivityRatio: 0,
      },
    );
    return { ...employee, ...employeeTotals };
  });
};

// SLICE
export const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    data: [],
    displayInactive: false,
    summary: { total: 0, inactive: 0, active: 0 },
    list: { employees: [] },
  },
  reducers: {
    setData: (state, action) => {
      // redux-toolkit actually uses immer.js to update state, so this is actually "immutable"
      state.data = action.payload;
      state.summary = {
        ...getSummary(state.data),
      };
      state.list = prepareEmployeesList(
        filter(state.data, {
          isActive: true,
        }),
        false,
      );
    },
    toggleInactive: (state) => {
      state.displayInactive = !state.displayInactive;
      state.summary = {
        ...getSummary(state.data, !state.displayInactive),
      };
      state.list = prepareEmployeesList(
        filter(state.data, {
          isActive: !state.displayInactive,
        }),
        !state.displayInactive,
      );
    },
    toggleEmployeeActivity: (state, action) => {
      state.data = state.data.map((employee) => {
        return employee.id === action.payload
          ? { ...employee, isActive: !employee.isActive }
          : employee;
      });
      state.list = prepareEmployeesList(
        filter(state.data, {
          isActive: !state.displayInactive,
        }),
        !state.displayInactive,
      );
    },
  },
});

// ACTIONS
export const {
  setData,
  toggleInactive,
  toggleEmployeeActivity,
} = employeesSlice.actions;

// SELECTORS
export const allEmployees = (state) => state.employees.data;
export const employeesList = (state) => state.employees.list;
export const summaryData = (state) => state.employees.summary;
export const displayInactive = (state) => state.employees.displayInactive;

// ASYNC FUNCTIONS
export const fetchData = () => (dispatch) => {
  setTimeout(async () => {
    const response = await axios.get(
      `http://localhost:3000/data/employeesData100.json`,
    );
    dispatch(setData(response.data));
  }, 500); // simulate fetching delay
};

export default employeesSlice.reducer;
