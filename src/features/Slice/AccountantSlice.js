import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accountants: [],
};

const AccountantSlice = createSlice({
    name: "Accountants",
    initialState,
    reducers: {
        createAccountants: (state, action) => {
            state.accountants = action.payload;
        },

    },
});

export const { createAccountants } = AccountantSlice.actions;

export default AccountantSlice.reducer;
