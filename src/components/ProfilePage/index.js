import React from 'react';
import './style.css'
import jwt_decode from 'jwt-decode'

class ProfilePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            isLoggedIn: false,
            first_name: "",
            second_name: "",
            email: "",
            is_superuser: ""

        }

    }

    componentDidMount() {
        const token = localStorage.usertoken;
        if (token){
            this.setState({isLoggedIn : true})
            const decoded = jwt_decode(token);
            this.setState({
                first_name: decoded.identity.first_name
            })
        } else {
            this.setState({isLoggedIn : false})
        }

    }

    render() {
        return (
            <div>
                {this.state.isLoggedIn?(<div>
                    <h1>Страница профиля</h1>
                    <p>{this.state.first_name}</p>
                </div>): (
                    <div>
                        <h1>Для получения доступа требуется авторизация</h1>
                    </div>)}
            </div>

        );
    }
}

export default ProfilePage;