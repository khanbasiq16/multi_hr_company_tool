import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRunning: false,
  elapsedTime: 0,
  startTime: null, 
};

const StopwatchSlice = createSlice({
  name: "stopwatch",
  initialState,
  reducers: {
    startTimer: (state, action) => {
      state.isRunning = true;
      state.startTime = action.payload; 
    },
    stopTimer: (state, action) => {
      if (state.isRunning && state.startTime) {
        const now = action.payload;
        state.elapsedTime += Math.floor((now - state.startTime) / 1000);
      }
      state.isRunning = false;
      state.startTime = null;
    },

    updatetime(state, action) {
      state.elapsedTime = action.payload;
    },

    resetTimer: (state) => {
      state.isRunning = false;
      state.elapsedTime = 0;
      state.startTime = null;
    },
  },
});

export const { startTimer, stopTimer, resetTimer , updatetime} = StopwatchSlice.actions;
export default StopwatchSlice.reducer;
