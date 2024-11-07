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
    doUpdateUserInfoAction: (state, action) => {
      state.user.avatar = action.payload.avatar;
      state.user.phone = action.payload.phone;
      state.user.fullName = action.payload.fullName;
    },

    doUploadAvatarAction: (state, action) => {
      state.tempAvatar = action.payload.avatar
    }

  },

  extraReducers: (builder) => {

  },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction, doUpdateUserInfoAction, doUploadAvatarAction } = accountSlice.actions;


export default accountSlice.reducer;
