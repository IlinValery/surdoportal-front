import React from 'react';
import './style.css'
import {Col, Row, Container, Jumbotron} from 'reactstrap'
import {Form, FormGroup, Input, Label, Button} from 'reactstrap'
import Fade from "reactstrap/es/Fade";


class LoginPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            email: "",
            password: "",
            renderAllow: false,
            errorCode: 0
        }
    }

    isLoggedIn(){
        if (localStorage.getItem('usertoken')!==null){
            window.location.replace('/profile/me')
        } else {
            this.setState({
                renderAllow: true
            })
        }

    }
    emailChange(value){
        //todo email validation minimum
        this.setState({
            email: value
        })
    }

    passwordChange(value){
        //todo password validation minimum
        this.setState({
            password: value
        })
    }

    sendData(){
        fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':this.state.email, 'password':this.state.password})
        })
            .then( (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('usertoken', data.token);
                    window.location.replace('/profile/me');
                }
                if (data.error){
                    this.setState({
                        errorCode: data.error.code
                    });
                    console.log(this.state.errorCode)
                }
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });




    }

    componentWillMount() {
        this.isLoggedIn();
    }

    render() {
        return (
            <div>
                {this.state.renderAllow? (<div>
                    <Container style={{marginTop: "8%",}}>
                        <Row>
                            <Col xl={"2"} xs={"0"}/>
                            <Col>
                                <Jumbotron>
                                    <h1>Войти в систему</h1>
                                    <Form>
                                        <FormGroup>
                                            <Label for="email">Электронная почта</Label>
                                            <Input type="email" name="email" id="email" required
                                                   placeholder="Ваша электронная почта"
                                                   onChange={(evt) => this.emailChange(evt.currentTarget.value)}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password">Пароль</Label>
                                            <Input type="password" name="password" id="password" required
                                                   onChange={(evt) => this.passwordChange(evt.currentTarget.value)}
                                                   placeholder="Ваш пароль"/>
                                        </FormGroup>
                                    </Form>
                                    <Row style={{marginTop: "16px",}}>
                                        <Col xl={"2"} xs={"1"}/>
                                        <Col>
                                            <Fade in={this.state.errorCode!==0} tag="h6" className={"text-center"} style={{color: "#ff6347"}}>
                                                {this.state.errorCode===1? ("Такого пользователя нет в системе"):("Неверный пароль")}
                                            </Fade>

                                            <Button color={"primary"} block size={"lg"}
                                                    onClick={() => this.sendData()}>
                                                Войти в систему
                                            </Button>
                                        </Col>
                                        <Col xl={"2"} xs={"1"}/>
                                    </Row>
                                </Jumbotron>
                            </Col>
                            <Col xl={"2"} xs={"0"}/>
                        </Row>
                    </Container>
                </div>):(<div></div>)}
            </div>

        );
    }
}

export default LoginPage;