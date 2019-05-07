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
import UncontrolledCollapse from "reactstrap/es/UncontrolledCollapse";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";

export default class ProfileEditPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            userID: undefined,
            contentLoaded: false,
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
                <h1 className={"text-center"}>Редактирование пользователя</h1>
                {!this.state.contentLoaded? (<LoadingMessage message={"Идет загрузка контента, подождите"}/>):(
                    <div>
                        <Container>
                            <Jumbotron>
                                <Form>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="first_name">Имя</Label>
                                                <Input type="text" name="first_name"
                                                       id="first_name"
                                                       defaultValue={this.state.userInfo.first_name}
                                                       placeholder="Имя"  />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup >
                                                <Label for="last_name">Фамилия</Label>
                                                <Input type="text" name="last_name"
                                                       id="last_name"
                                                       defaultValue={this.state.userInfo.last_name}
                                                       placeholder="Фамилия"/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Jumbotron className={"border border-danger"} style={{padding: "3% 3%"}}>
                                        <p style={{marginBottom: "0.5rem"}}>Email</p>
                                        <InputGroup>
                                            <Input type="email" name="email" id="email"
                                                   placeholder="Электронная почта сотрудника"
                                                   defaultValue={this.state.userInfo.email} />
                                            <InputGroupAddon addonType="append">
                                                <Button outline color="danger" id="password_change" style={{ marginBottom: '1rem' }}>
                                                    Изменить пароль
                                                </Button>
                                            </InputGroupAddon>

                                        </InputGroup>


                                        <UncontrolledCollapse toggler="password_change">
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="password">Новый пароль</Label>
                                                        <Input type="password" name="password" id="password" placeholder="Пароль"/>
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup >
                                                        <Label for="conf_password">Подтвердите пароль</Label>
                                                        <Input type="password" name="conf_password" id="conf_password" placeholder="Подтвердите пароль"/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </UncontrolledCollapse>




                                            <FormGroup check style={{paddingLeft:0}}>
                                                <Label check >
                                                    <CustomInput defaultChecked={this.state.userInfo.is_superuser} type="switch" onChange={()=>{console.log("change")}} id="exampleCustomSwitch" name="customSwitch" label="Администратор в системе" />

                                                </Label>
                                            </FormGroup>
                                    </Jumbotron>
                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"} onClick={()=>this.createUser()}>Сохранить изменения</Button>
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
                        contentLoaded: true
                    })
                })
                .catch((err) => {
                    console.log('Fetch Error:', err);
                });

        }
    }

}