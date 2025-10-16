import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ipwhitelist: [],
};

const IpwhiteSlice = createSlice({
  name: "ipwhite",
  initialState,
  reducers: {
    getallipwhitelist: (state, action) => {
      state.ipwhitelist = action.payload;
    },

  },
});

export const { getallipwhitelist } = IpwhiteSlice.actions;

export default IpwhiteSlice.reducer;
