import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
  carts: []
};


export const orderSlice = createSlice({
  name: 'order',
  initialState,

  reducers: {
    doAddBookAction: (state, action) => {
      // console.log(state.carts)
      let carts = state.carts;
      const item = action.payload;
      // console.log(" check item", carts)
      let isExistIndex = carts.findIndex(c => c._id === item._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity += item.quantity;
        if (carts[isExistIndex].quantity > item.quantity) {
          carts[isExistIndex].quantity = item.quantity
        }
      } else {
        carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
      }
      state.carts = carts;
    }
  },

  extraReducers: (builder) => {

  },
});

export const { doAddBookAction } = orderSlice.actions;


export default orderSlice.reducer;
