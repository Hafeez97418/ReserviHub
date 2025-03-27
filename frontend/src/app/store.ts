import { configureStore } from "@reduxjs/toolkit";
import UiReducer from "../features/ui/uiSlice";
import businessSlice from "../features/business/slice";
import globalSlice from "../features/globalSlice";
import SlotSlice from "../features/slots/slice";

export default configureStore({
  reducer: {
    ui: UiReducer,
    business: businessSlice.reducer,
    global: globalSlice.reducer,
    slot: SlotSlice.reducer,
  },
});
