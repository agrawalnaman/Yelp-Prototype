import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    orders: [],
};
const ordersSlice = createSlice({
    initialState,
    name :"ordersSlice",
    reducers:{
        setOrders : (state,action) => {
            state["orders"]= action.payload
        },
    }
});

export const {setOrders}=ordersSlice.actions;
export default ordersSlice.reducer;