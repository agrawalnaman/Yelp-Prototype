import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    upcomingevents: [],
};
const upcomingeventsSlice = createSlice({
    initialState,
    name :"upcomingeventsSlice",
    reducers:{
        setUpcomingevents : (state,action) => {
            state["upcomingevents"]= action.payload
        },
    }
});

export const {setUpcomingevents}=upcomingeventsSlice.actions;
export default upcomingeventsSlice.reducer;

