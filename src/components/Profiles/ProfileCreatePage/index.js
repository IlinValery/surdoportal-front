import React from 'react';
import './style.css'
import LoadingMessage from "../../Common/LoadingMessage";

import Jumbotron from "reactstrap/es/Jumbotron";
import Container from "reactstrap/es/Container";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Button from "reactstrap/es/Button";
import CustomInput from "reactstrap/es/CustomInput";

export default class ProfileCreatePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            userID: undefined,
            isFromForEdit: false,
            userInfo: null

        }

    }

    componentWillMount() {
        let u_id = parseInt(this.props.match.params.number, 10)
        this.setState({
            userID: u_id,
            isFromForEdit: u_id>0
        })
    }
    createUser(){
        alert("blasd")
    }

    render() {
        console.log(this.state.userInfo)
        return (
            <div>
            {this.state.userID===undefined? (<LoadingMessage message={"Идет загрузка контента, подождите"}/>):(
                    <div>
                        <h1 className={"text-center"}>{this.state.isFromForEdit? ("Редактирование пользователя"):
                            ("Добавление нового пользователя")}</h1>
                        <Container>
                            <Jumbotron>
                                <Form>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="first_name">Имя</Label>
                                                <Input type="text" name="first_name" id="first_name" placeholder="Имя" />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup >
                                                <Label for="last_name">Фамилия</Label>
                                                <Input type="text" name="last_name" id="last_name" placeholder="Фамилия" />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Jumbotron className={"border border-danger"} style={{padding: "3% 3%"}}>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input type="email" name="email" id="email" placeholder="Электронная почта сотрудника" />
                                        </FormGroup>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="password">Пароль</Label>
                                                    <Input type="password" name="password" id="password" placeholder="Пароль" />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup >
                                                    <Label for="conf_password">Подтвердите пароль</Label>
                                                    <Input type="password" name="conf_password" id="conf_password" placeholder="Подтвердите пароль"/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <div className={"text-center"}>
                                            <FormGroup check>
                                                <Label check >
                                                    <CustomInput defaultChecked={"true"} type="switch"  id="exampleCustomSwitch" name="customSwitch" label="Администратор в системе" />

                                                </Label>
                                            </FormGroup>
                                        </div>
                                    </Jumbotron>
                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"} onClick={()=>this.createUser()}>Создать пользователя</Button>
                                </div>
                            </Jumbotron>
                        </Container>

                    </div>
                )}
            </div>
        );
    }

    componentDidMount() {
        if (this.state.isFromForEdit){
            fetch('/api/user/'+this.state.userID)
                .then( (response) => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    return response.json();
                })
                .then((data) => {
                    this.setState({
                        userInfo: data.data,
                    })
                })
                .catch((err) => {
                    console.log('Fetch Error:', err);
                });

        }
    }

}