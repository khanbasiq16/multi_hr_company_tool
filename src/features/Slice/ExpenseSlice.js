import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
};

const ExpenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {

    getallexpense: (state, action) => {
      state.expenses = action.payload;
    },

  },
});

export const { getallexpense } = ExpenseSlice.actions;

export default ExpenseSlice.reducer;
