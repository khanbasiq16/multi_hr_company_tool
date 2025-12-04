import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Accountants: [],
};

const AccountantSlice = createSlice({
    name: "Accountants",
    initialState,
    reducers: {

        createAccountants: (state, action) => {
            state.Accountants = action.payload;
        },

    },
});

export const { createAccountants } = AccountantSlice.actions;

export default AccountantSlice.reducer;
