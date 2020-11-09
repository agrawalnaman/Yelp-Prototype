import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};
const messagesSlice = createSlice({
    initialState,
    name :"messagesSlice",
    reducers:{
        setMessages : (state,action) => {
            state["messages"]= action.payload
        },
    }
});

export const {setMessages}=messagesSlice.actions;
export default messagesSlice.reducer;

