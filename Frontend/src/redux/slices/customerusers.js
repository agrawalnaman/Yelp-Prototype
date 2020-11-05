import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    customerusers: [],
};
const customerusersSlice = createSlice({
    initialState,
    name :"customerusersSlice",
    reducers:{
        setCustomerusers : (state,action) => {
            state["customerusers"]= action.payload
        },
    }
});

export const {setCustomerusers}=customerusersSlice.actions;
export default customerusersSlice.reducer;

