import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: [],
};


export const orderSlice = createSlice({
    name: 'order',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        handleAddBookAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            let isExistIndex = carts.findIndex(c => c._id === item._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity;
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }
            } else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            }
            state.carts = carts;
            message.success("Add the book success to cart!")
        },
        handleUpdateCartAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            let isExistIndex = carts.findIndex(c => c._id === item._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = item.quantity;
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }
            } else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            }
            state.carts = carts;
        },
        handleDeleteCartAction: (state, action) => {
            state.carts = state.carts.filter(x => x._id !== action.payload._id)
        },
        handlePlaceOrderAction: (state, action) => {
            state.carts = [];
        }

    },

    extraReducers: (builder) => {

    },
});

export const { handleAddBookAction, handleUpdateCartAction, handleDeleteCartAction, handlePlaceOrderAction } = orderSlice.actions;

export default orderSlice.reducer;
