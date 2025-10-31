import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeZone: [],
};

const TimeZoneSlice = createSlice({
  name: "timezone",
  initialState,
  reducers: {
    getallzones: (state, action) => {
      state.timeZone = action.payload;
    },

  },
});

export const { getallzones } = TimeZoneSlice.actions;

export default TimeZoneSlice.reducer;
