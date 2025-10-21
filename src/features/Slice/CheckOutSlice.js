import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCheckedOut: false,
  checkOutTime: "",
};

const checkOutSlice = createSlice({
  name: "checkOut",
  initialState,
  reducers: {
    setCheckOut: (state, action) => {
      state.isCheckedOut = true;
      state.checkOutTime = action.payload;
    },
    resetCheckOut: (state) => {
      state.isCheckedOut = false;
      state.checkOutTime = "";
    },
  },
});

export const { setCheckOut, resetCheckOut } = checkOutSlice.actions;
export default checkOutSlice.reducer;
