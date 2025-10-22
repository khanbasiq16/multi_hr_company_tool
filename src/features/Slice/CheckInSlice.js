

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCheckedIn: false,
  checkInTime: "",
  checkInDate: "",
  attendenceid:""
};

const checkInSlice = createSlice({
  name: "checkIn",
  initialState,
  reducers: {
    setCheckIn: (state, action) => {
      state.isCheckedIn = true;
      state.checkInTime = action.payload.time;
    },
    resetCheckIn: (state) => {
      state.isCheckedIn = false;
      state.checkInTime = "";
      state.checkInDate = "";
    },
    setattendanceid:(state , action) => {
      
      state.attendenceid = action.payload
    },

  },
});

export const { setCheckIn, resetCheckIn , setattendanceid } = checkInSlice.actions;
export default checkInSlice.reducer;
