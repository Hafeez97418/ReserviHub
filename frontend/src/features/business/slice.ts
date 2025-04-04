// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { Business } from "../../lib/types";

const iniState: {
  businessList: Business[];
  searchValue: string;
  search: boolean;
  aiSearch: boolean;
} = {
  businessList: [],
  searchValue: "",
  search: true,
  aiSearch: false,
};

const businessSlice = createSlice({
  name: "auth",
  initialState: iniState,
  reducers: {
    setBusinessList: (state, action) => {
      const merged = [...state.businessList, ...action.payload];
      const unique: Business[] = Array.from(
        new Map(merged.map((item) => [item.id, item])).values()
      );
      state.businessList = unique;
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
    },
    setAiSearch: (state) => {
      state.aiSearch = !state.aiSearch;
    },
  },
});

export const {
  setBusinessList,
  replaceBusinessList,
  setSearchValue,
  setSearch,
  setAiSearch,
} = businessSlice.actions;
export default businessSlice;
