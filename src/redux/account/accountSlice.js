import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
  isAuthenticated: false,
  user: {
    "email": "",
    "phone": "",
    "fullName": "",
    "role": "",
    "avatar": "",
    "id": ""
  }
};


export const accountSlice = createSlice({
  name: 'account',
  initialState,

  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      // console.log("payload<<", action.payload.data)
      state.user = action.payload;
    },

    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    doLogoutAction: (state, action) => {
      state.isAuthenticated = false;
      state.user = {
        "email": "",
        "phone": "",
        "fullName": "",
        "role": "",
        "avatar": "",
        "id": ""
      }
      localStorage.removeItem("access_token");
    },
  },

  extraReducers: (builder) => {

  },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction } = accountSlice.actions;


export default accountSlice.reducer;
