import { createSlice } from "@reduxjs/toolkit";

const iniState = {
  open_sidebar: false,
  otp_form: false,
};
const UiSlice = createSlice({
  name: "ui",
  initialState: iniState,
  reducers: {
    toggleSideBar: (state) => {
      if (!state.open_sidebar) state.open_sidebar = true;
      else state.open_sidebar = false;
    },
    toggleOTPForm: (state) => {
      if (!state.otp_form) state.otp_form = true; 
      else state.otp_form = false;
    },
  },
});

const UiReducer = UiSlice.reducer;
const { toggleSideBar , toggleOTPForm} = UiSlice.actions;

export default UiReducer;
export { toggleSideBar , toggleOTPForm};
