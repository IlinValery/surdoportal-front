import React from 'react';
import './style.css'
import jwt_decode from 'jwt-decode'
import {Jumbotron} from "reactstrap";
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Button from "reactstrap/es/Button";
import ProfileChangePasswordForm from "../ProfileChangePasswordForm";
import LogsTable from "../../Logs/LogsTable";

class ProfilePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            userID: 0,
            isLoggedIn: false,
            first_name: "",
            last_name: "",
            email: "",
            is_superuser: null

        }

    }

    componentDidMount() {
        const token = localStorage.usertoken;
        if (token){
            this.setState({isLoggedIn : true})
            const decoded = jwt_decode(token);
            this.setState({
                userID: decoded.identity.id,
                first_name: decoded.identity.first_name,
                last_name: decoded.identity.last_name,
                email: decoded.identity.email,
                is_superuser: decoded.identity.is_superuser,
            })
        } else {
            this.setState({isLoggedIn : false})
        }

    }

    render() {
        return (
            <div style={{marginTop: "20px"}}>
                <Container>
                    <Row>
                        <Col>
                            <Jumbotron>
                            {this.state.isLoggedIn?(<div>
                                <h1 className={"text-left"}>Личная страница профиля</h1>
                                <h3>Пользователь: <u>{this.state.first_name} {this.state.last_name}</u></h3>
                                <h3>Электронная почта: <a href={"mailto:"+ this.state.email}>{this.state.email}</a></h3>
                                <h3>Статус в системе: {this.state.is_superuser? ("администратор системы"): ("сурдопереводчик")}.</h3>
                                <Button outline color="danger" id="password_change" style={{ marginBottom: '1rem' }}>
                                    Изменить пароль
                                </Button>
                                <ProfileChangePasswordForm userID={this.state.userID} btn_position={"left"} next={"/profile/me"}/>
                            </div>): (
                                <div>
                                    <h1>Для получения доступа требуется авторизация</h1>
                                </div>)}
                            </Jumbotron>
                            <h2>Ваши последние действия</h2>
                            <LogsTable admin={false} max_count={10}/>
                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}

export default ProfilePage;