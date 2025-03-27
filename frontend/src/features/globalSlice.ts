// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const iniState = {
  errMsg: "",
  showErr: false,
  Msg: "",
  showAlert: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState: iniState,
  reducers: {
    setMessage(state, action) {
      state.errMsg = action.payload;
      state.showErr = !state.showErr;
    },
    setAlertMessage(state, action) {
      state.showAlert = !state.showAlert;
      state.Msg = action.payload;
    },
  },
});

export const { setMessage, setAlertMessage } = globalSlice.actions;
export default globalSlice;
