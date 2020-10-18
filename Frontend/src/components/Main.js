import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import NavbarComponent from './LandingPage/NavbarComponent';
import Signup from './Signup/Signup';
import RestaurantMain from './RestaurantMain/RestaurantMain';
import RestaurantOrders from './RestaurantOrders/RestaurantOrders';
import RestaurantEvents from './RestaurantEvents/RestaurantEvents';
import CustomerMain from './CustomerMain/CustomerMain';
import CustomerProfile from './CustomerProfile/CustomerProfile';
import CustomerOrders from './CustomerOrders/CustomerOrders';
import CustomerEvents from './CustomerEvents/CustomerEvents';
import CustomerProfileModular from './CustomerProfile/CustomerProfileModular';
import RestaurantPage from './RestaurantPage/RestaurantPage';
import OrderFood from './Cart/OrderFood';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={NavbarComponent}/>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/RestaurantMain" component={RestaurantMain}/>
                <Route path="/RestaurantOrders" component={RestaurantOrders}/>
                <Route path="/RestaurantEvents" component={RestaurantEvents}/>
                <Route path="/CustomerMain" component={CustomerMain}/>
                <Route path="/CustomerProfile" component={CustomerProfile}/>
                <Route path="/CustomerOrders" component={CustomerOrders}/>
                <Route path="/CustomerEvents" component={CustomerEvents}/>
                <Route path="/CustomerProfileModular" component={CustomerProfileModular}/>
                <Route path="/RestaurantPage" component={RestaurantPage}/>
                <Route path="/OrderFood" component={OrderFood}/>
        

            </div>
        )
    }
}
//Export The Main Component
export default Main;