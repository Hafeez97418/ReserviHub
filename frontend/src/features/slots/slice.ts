import { createSlice } from "@reduxjs/toolkit";
import { Interval } from "../../lib/types";

const iniState: { slots: Interval[] } = {
  slots: [],
};
const SlotSlice = createSlice({
  name: "slot",
  initialState: iniState,
  reducers: {
    addSlots: (state, action) => {
      const merged = [...state.slots, ...action.payload];
      const unique = Array.from(
        new Map(merged.map((item) => [item.id, item])).values()
      );
      state.slots = unique as any;
    },
    addSlot: (state, action) => {
      state.slots.push(action.payload);
    },
    removeSlot: (state, action) => {
      state.slots = state.slots.filter((slot) => {
        return slot.id !== action.payload;
      });
    },
    replaceSlots: (state, action) => {
      state.slots = action.payload;
    }
  },
});

export const { addSlots, removeSlot, addSlot , replaceSlots} = SlotSlice.actions;

export default SlotSlice;
