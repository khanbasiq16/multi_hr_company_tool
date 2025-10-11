import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  department: [],
};

const DepartmentSlice = createSlice({
  name: "Department",
  initialState,
  reducers: {
    createdepartment: (state, action) => {
      state.department = action.payload;
    },

  },
});

export const {  createdepartment } = DepartmentSlice.actions;

export default DepartmentSlice.reducer;
