import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: [],
};

const CompanySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
  
    createcompany: (state, action) => {
      state.companies = action.payload;
    },

  },
});

export const {  createcompany } = CompanySlice.actions;

export default CompanySlice.reducer;
