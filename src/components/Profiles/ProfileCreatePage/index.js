import React from 'react';
import './style.css'
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
import Fade from "reactstrap/es/Fade";
import FormFeedback from "reactstrap/es/FormFeedback";

export default class ProfileCreatePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            first_name: "",
            last_name: "",
            email: "",
            emailValidated: false,
            password: "",
            confirm_password: "",
            passwordValidated: false,
            is_superuser: false,
            accessCreate: false,
            creationStatus: -1
        };
        this.changeFields = this.changeFields.bind(this);
        this.changeSuperuserField = this.changeSuperuserField.bind(this);
    }

    changeSuperuserField(){
        this.setState({
            is_superuser: !this.state.is_superuser
        });
    }

    isEmptyField = field => field === "";

    checkEmail = email => {
        let re = /^([a-z0-9_.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
        if (re.test(String(email).toLowerCase())){
            this.setState({emailValidated:true});
        } else {
            this.setState({emailValidated:false});
        }
    };

    checkPassword = (password, confirm_pass) => {
        let status = false;
        if (password.length<8 || confirm_pass.length<8){
            status = false;
        } else {
            if (password===confirm_pass){
                status = true
            } else {
                status = false;
            }
        }
        this.setState({passwordValidated: status})
    };

    setFieldsToState(e){
        this.setState({[e.target.name]: e.target.value});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 200)
        });
    }
    changeFields(e){
        this.setFieldsToState(e).then(()=>
        {
            if (this.isEmptyField(this.state.first_name) || this.isEmptyField(this.state.last_name) ||
                this.isEmptyField(this.state.email) || this.isEmptyField(this.state.password) ||
                this.isEmptyField(this.state.confirm_password)) {this.setState({ accessCreate: false})}
            else { this.setState({ accessCreate: true })
            }
            this.checkPassword(this.state.password, this.state.confirm_password);
            this.checkEmail(this.state.email);
        })
    }



    createUser(){
        fetch('/api/user/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'email':this.state.email,
                'password':this.state.password,
                'first_name':this.state.first_name,
                'last_name':this.state.last_name,
                'is_superuser':this.state.is_superuser? 1:0,
            })
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
                if (data.result.code===1){
                    this.setState({creationStatus: 1})
                } else {
                    window.location.href = '/profile/all'
                }
                //console.log(data.result)
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
    }

    render() {

        return (
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
                                        <Input type="text" name="first_name" id="first_name"
                                               onChange={this.changeFields} placeholder="Имя" />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup >
                                        <Label for="last_name">Фамилия</Label>
                                        <Input type="text" name="last_name" id="last_name"
                                               onChange={this.changeFields} placeholder="Фамилия" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Jumbotron className={"border border-danger"} style={{padding: "3% 3%"}}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input type="email" name="email" id="email"
                                           onChange={this.changeFields}
                                            {...this.state.email.length>0 ? {...this.state.emailValidated? {valid: true}: {invalid:true}}: {}}
                                            placeholder="Электронная почта сотрудника"/>
                                    <FormFeedback invalid={"true"}>Поле email должно быть в формате example@exam.com</FormFeedback>
                                </FormGroup>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="password">Пароль</Label>
                                            <Input type="password" name="password" id="password"
                                                   onChange={this.changeFields}
                                                   {...this.state.password.length>0 ? {...this.state.password.length<8 ? {invalid: true}: {valid:true}}: {}}
                                                   placeholder="Пароль"/>
                                            <FormFeedback invalid={"true"}>Пароль должен содержать более 8 символов!</FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup >
                                            <Label for="conf_password">Подтвердите пароль</Label>
                                            <Input type="password" name="confirm_password" id="conf_password"
                                                   onChange={this.changeFields}
                                                   {...this.state.confirm_password.length>0 ? {...this.state.password.length!==this.state.confirm_password.length ? {invalid: true}: {valid:true}}: {}}
                                                   placeholder="Подтвердите пароль"/>
                                            <FormFeedback invalid={"true"}>Пароли должны совпадать!</FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup check style={{paddingLeft:0}}>
                                    <Label check >
                                        <CustomInput type="switch"  id="exampleCustomSwitch" name="customSwitch"
                                                     onClick={this.changeSuperuserField}
                                                     label="Администратор в системе" />

                                    </Label>
                                </FormGroup>
                            </Jumbotron>
                        </Form>
                        <div className={"text-center"}>
                            <Button color={"primary"}
                                    {...(this.state.accessCreate && this.state.emailValidated && this.state.passwordValidated ) ? {}: {disabled: true}}
                                    onClick={()=>this.createUser()}>Создать пользователя</Button>
                            <Fade in={this.state.creationStatus>0} tag="h6" className={"text-center"} style={{color: "#ff6347", marginTop: "16px"}}>
                                Ошибка сервера. Пользователь в системе существует
                            </Fade>
                        </div>
                    </Jumbotron>
                </Container>
            </div>
        );
    }



}