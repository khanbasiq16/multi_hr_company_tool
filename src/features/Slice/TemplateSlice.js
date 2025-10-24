import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  templates: [],
};

const TemplateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
  
    createtemplate: (state, action) => {
      state.templates = action.payload;
    },

  
  },
});

export const {  createtemplate } = TemplateSlice.actions;

export default TemplateSlice.reducer;
