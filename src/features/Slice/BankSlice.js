import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    banks: [],
    bank: {},
};

const banksSlice = createSlice({
    name: "Banks",
    initialState,
    reducers: {
        createallBanks: (state, action) => {
            state.banks = action.payload;
        },

        bankdetails: (state, action) => {
            state.bank = action.payload;
        }
    },
});

export const { createallBanks, bankdetails } = banksSlice.actions;

export default banksSlice.reducer;
