import React from 'react';
import {Route} from 'react-router-dom'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import ProfilePage from "./components/ProfilePage";
import TermsPublicPage from "./components/TermsPublicPage";
import ProfilesPage from "./components/ProfilesPage";
import Page404 from "./components/404Page";

class Content extends React.Component {
    render() {
        return (
            <div className={"portal-content"}>

                <Route exact path='/' component={HomePage}/>
                <Route exact path='/login' component={LoginPage}/>
                <Route exact path='/profile/me' component={ProfilePage}/>
                <Route exact path='/profile/all' component={ProfilesPage}/>
                <Route exact path='/terms' component={TermsPublicPage}/>


                <Route exact path='/404' component={Page404}/>

            </div>
        );
    }
}

export default Content;