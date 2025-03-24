import { configureStore } from "@reduxjs/toolkit";
import UiReducer from "../features/ui/uiSlice";
import businessSlice from "../features/business/slice";

export default configureStore({
  reducer: {
    ui: UiReducer,
    business: businessSlice.reducer,
  },
});
