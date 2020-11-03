import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    dishes: [],
};
const dishesSlice = createSlice({
    initialState,
    name :"dishesSlice",
    reducers:{
        setDishes : (state,action) => {
            state["dishes"]= action.payload
        },
    }
});

export const {setDishes}=dishesSlice.actions;
export default dishesSlice.reducer;

