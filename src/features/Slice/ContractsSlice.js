import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contracts: [],
};

const ContractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    
    createcontracts: (state, action) => {
      state.contracts = action.payload;
    },

  },
});

export const {  createcontracts } = ContractsSlice.actions;

export default ContractsSlice.reducer;
