import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
};

const ClientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
  
    getallclients: (state, action) => {
      state.clients = action.payload;
    },

  },
});

export const {  getallclients } = ClientSlice.actions;

export default ClientSlice.reducer;
