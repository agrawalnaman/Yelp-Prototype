import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    customerorders: [],
};
const customerordersSlice = createSlice({
    initialState,
    name :"customerordersSlice",
    reducers:{
        setCustomerorders : (state,action) => {
            state["customerorders"]= action.payload
        },
    }
});

export const {setCustomerorders}=customerordersSlice.actions;
export default customerordersSlice.reducer;

