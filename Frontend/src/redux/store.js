
import thunk from 'redux-thunk';
import {configureStore} from "@reduxjs/toolkit";
import loginReducer from "../redux/slices/login";
import updateReducer from "../redux/slices/home";
import dishesReducer from "../redux/slices/dishes";
import eventsReducer from "../redux/slices/events";
import ordersReducer from "../redux/slices/orders";
import customerordersReducer from "../redux/slices/customerorders";
import upcomingeventsReducer from "../redux/slices/upcomingevents";
import customerusersReducer from "../redux/slices/customerusers";
const store = configureStore({
    reducer : {
        loginState:loginReducer,
        updateState:updateReducer,
        dishesState: dishesReducer,
        eventsState:eventsReducer,
        ordersState:ordersReducer,
        customerordersState:customerordersReducer,
        upcomingeventsState:upcomingeventsReducer,
        customerusersState:customerusersReducer
    },
    devTools : true,
    middleware : [thunk]
});

export default store;
