
import thunk from 'redux-thunk';
import {configureStore} from "@reduxjs/toolkit";
import loginReducer from "../redux/slices/login";
import updateReducer from "../redux/slices/home";
const store = configureStore({
    reducer : {
        loginState:loginReducer,
        updateState:updateReducer,

    },
    devTools : true,
    middleware : [thunk]
});

export default store;
