import { configureStore } from "@reduxjs/toolkit";
import  UiReducer  from "../features/ui/uiSlice";

export default configureStore({
  reducer: {
    ui:UiReducer,
  },
});
