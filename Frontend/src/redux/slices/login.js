import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    username:"",
    authFlag: false,
    customerID:"",
} ;
const loginSlice = createSlice({
    initialState,
    name :"loginReducer",
    reducers:{
        setUsername : (state,action) => {
            state["username"]= action.payload
        },
        setAuthFlag : (state,action) => {
            state["authFlag"] = action.payload
        },
        setCustomerID : (state,action) => {
            console.log("CUST ID: ", action.payload);
            state["customerID"] = action.payload
        },
    }
});

export const {setUsername,setAuthFlag,setCustomerID}=loginSlice.actions;
export default loginSlice.reducer;

