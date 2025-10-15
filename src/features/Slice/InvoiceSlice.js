import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
};

const InvoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    getallinvoice: (state, action) => {
      state.invoices = action.payload;
    },

  },
});

export const { getallinvoice } = InvoiceSlice.actions;

export default InvoiceSlice.reducer;
