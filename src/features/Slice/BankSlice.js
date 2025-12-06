import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    banks: [],
};

const banksSlice = createSlice({
    name: "Banks",
    initialState,
    reducers: {
        
        createallBanks: (state, action) => {
            state.banks = action.payload;
        },

    },
});

export const { createallBanks } = banksSlice.actions;

export default banksSlice.reducer;
