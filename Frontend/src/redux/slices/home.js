import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    country:"",
} ;
const updateSlice = createSlice({
    initialState,
    name :"updateReducer",
    reducers:{
        setFirstname : (state,action) => {
            state["firstname"]= action.payload
        },
        setLastname : (state,action) => {
            state["lastname"] = action.payload
        },
        setEmail : (state,action) => {
           
            state["email"] = action.payload
        },
        setCountry : (state,action) => {
           
            state["country"] = action.payload
        },
    }
});

export const {setFirstname,setLastname,setEmail,setCountry}=updateSlice.actions;
export default updateSlice.reducer;

