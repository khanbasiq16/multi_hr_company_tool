import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
};

const EmployeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
  
    createemployees: (state, action) => {
      state.employees = action.payload;
    },

  },
});

export const {  createemployees } = EmployeeSlice.actions;

export default EmployeeSlice.reducer;
