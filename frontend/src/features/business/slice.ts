// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const iniState = {
  businessList: [],
  searchValue: "",
  search:true,
};

const businessSlice = createSlice({
  name: "auth",
  initialState: iniState,
  reducers: {
    setBusinessList: (state, action) => {
      const merged = [...state.businessList, ...action.payload];
      const unique = Array.from(
        new Map(merged.map((item) => [item.id, item])).values()
      );
      state.businessList = unique as any;
    },
    replaceBusinessList: (state, action) => {
      const newList = action.payload;
      state.businessList = newList;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setSearch: (state) => {
      state.search = !state.search;
    }
  },
});

export const { setBusinessList, replaceBusinessList, setSearchValue , setSearch } =
  businessSlice.actions;
export default businessSlice;
