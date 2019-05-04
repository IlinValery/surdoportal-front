import React from 'react';
import {Route} from 'react-router-dom'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import ProfilePage from "./components/ProfilePage";

class Content extends React.Component {
    render() {
        return (
            <div className={"portal-content"}>

                <Route exact path='/' component={HomePage}/>
                <Route exact path='/login' component={LoginPage}/>
                <Route exact path='/profile' component={ProfilePage}/>

            </div>
        );
    }
}

export default Content;