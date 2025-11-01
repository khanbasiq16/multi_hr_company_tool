import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    UpdateUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
    },

  },
});

export const {  loginSuccess,UpdateUser , logout } = UserSlice.actions;

export default UserSlice.reducer;
