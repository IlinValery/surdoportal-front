import React from 'react';
import {Route, Switch} from 'react-router-dom'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import ProfilePage from "./components/Profiles/MyProfilePage";
import TermsPublicPage from "./components/Terms/TermsPublicPage";
import ProfilesPage from "./components/Profiles/ProfilesPage";
import Page404 from "./components/404Page";
import jwt_decode from "jwt-decode";
import ProfileCreatePage from "./components/Profiles/ProfileCreatePage";
import ProfileEditPage from "./components/Profiles/ProfileEditPage";
import LogsPage from "./components/Logs/LogsPage";
import DepartmentPage from "./components/Department/DepartmentPage";
import DisciplinePage from "./components/Discipline/DisciplinePage";
import TeacherPage from "./components/Teacher/TeacherPage";
import TermsAdminPage from "./components/Terms/TermsAdminPage";
import TermEditorPage from "./components/Terms/TermEditorPage";


class Content extends React.Component {
    constructor(props){
        super(props);

        this.state={
            loggedIn: false,
            isSuperuser: false
        }

    }

    componentWillMount() {
        let token = localStorage.getItem('usertoken');
        try {
            let decoded = jwt_decode(token);
            this.setState({
                loggedIn: true,
                isSuperuser: decoded.identity.is_superuser===1,
            });
        } catch (e) {
            this.setState({
                loggedIn: false,
                isSuperuser: false,
            });
        }
    }

    render() {
        return (
            <div className={"portal-content"}>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route exact path='/login' component={LoginPage}/>
                    <Route exact path='/terms' component={TermsPublicPage}/>

                    {!this.state.loggedIn ? (<Route exact path='*' component={Page404} status={"not_found"}/>) : (
                            <Switch>
                                <Route exact path='/profile/me' component={ProfilePage}/>
                                <Route exact path='/terms/editor/:number' component={TermEditorPage}/>
                                <Route exact path='/terms/editor' component={TermsAdminPage}/>
                                {/*Здесь все, что доступно только зашедшим в систему*/}

                                {this.state.isSuperuser ? (<Switch>
                                    <Route exact path='/profile/all' component={ProfilesPage}/>
                                    <Route exact path='/profile/new' component={ProfileCreatePage}/>
                                    <Route exact path='/profile/edit/:number' component={ProfileEditPage}/>

                                    <Route exact path='/admin/logs' component={LogsPage}/>

                                    <Route exact path='/admin/departments' component={DepartmentPage}/>
                                    <Route exact path='/admin/disciplines' component={DisciplinePage}/>
                                    <Route exact path='/admin/teachers' component={TeacherPage}/>

                                    <Route exact path='*' component={Page404} status={"permissions"}/>

                                </Switch>) : (<Route exact path='*' component={Page404} status={"permissions"}/>)}
                            </Switch>
                    )}

                </Switch>

            </div>
        );
    }
}

export default Content;