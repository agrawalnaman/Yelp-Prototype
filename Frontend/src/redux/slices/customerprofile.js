import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    customerprofile: [],
};
const customerprofileSlice = createSlice({
    initialState,
    name :"customerprofileSlice",
    reducers:{
        setCustomerprofile : (state,action) => {
            state["customerprofile"]= action.payload
        },
    }
});

export const {setCustomerprofile}=customerprofileSlice.actions;
export default customerprofileSlice.reducer;

