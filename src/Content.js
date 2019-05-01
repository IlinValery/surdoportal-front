import React from 'react';
import {Route} from 'react-router-dom'

import HomePage from './components/HomePage'

class Content extends React.Component {
    render() {
        return (
            <div className={"portal-content"}>

                <Route exact path='/' component={HomePage}/>

            </div>
        );
    }
}

export default Content;