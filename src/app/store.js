import { configureStore } from '@reduxjs/toolkit';
import employessReducer from '../features/employees/employeesSlice';

export default configureStore({
  reducer: {
    employees: employessReducer,
  },
});
