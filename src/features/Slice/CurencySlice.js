import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    curency: [],
};

const curencySlice = createSlice({
    name: "Curency",
    initialState,
    reducers: {
        
        createallCurency: (state, action) => {
            state.curency = action.payload;
        },

    },
});

export const { createallCurency } = curencySlice.actions;

export default curencySlice.reducer;
