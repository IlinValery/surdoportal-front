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
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import ProfileChangePasswordForm from "../ProfileChangePasswordForm";

export default class ProfileEditPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            userID: undefined,
            contentLoaded: false,
            userInfo: null,
            first_name: "",
            last_name: "",
            email: "",
            emailValidated: false,
            fieldsValidated: false,
            password: "",
            confirm_password: "",
            passwordValidated: false,
            passwordWasChanged: false,
            is_superuser: false,
            accessCreate: false,
            serverEditStatus: -1
        }

        this.changeFields = this.changeFields.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeSuperuserField = this.changeSuperuserField.bind(this);

    }

    changeSuperuserField(){
        this.setState({
            is_superuser: !this.state.is_superuser,
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
            this.verifyFields()
        })
    }

    verifyFields(){
        if (this.isEmptyField(this.state.first_name) || this.isEmptyField(this.state.last_name) ||
            this.isEmptyField(this.state.email)) {this.setState({ fieldsValidated: false})}
        else { this.setState({ fieldsValidated: true })
        }
        this.checkEmail(this.state.email);
    }

    changePassword(e){
        this.setFieldsToState(e).then(()=>
        {
            if (this.isEmptyField(this.state.password) && this.isEmptyField(this.state.confirm_password)) {
                this.setState({ passwordWasChanged: false})}
            else { this.setState({ passwordWasChanged: true })
            }
            this.checkPassword(this.state.password, this.state.confirm_password);
        })
    }


    componentWillMount() {
        let u_id = parseInt(this.props.match.params.number, 10);
        this.setState({
            userID: u_id,
            isFromForEdit: u_id>0
        })
    }

    changeUserInfo(){
        console.log(this.state)
    }
    render() {
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
                                                       onChange={this.changeFields}
                                                       placeholder="Имя"  />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup >
                                                <Label for="last_name">Фамилия</Label>
                                                <Input type="text" name="last_name"
                                                       id="last_name"
                                                       defaultValue={this.state.userInfo.last_name}
                                                       onChange={this.changeFields}
                                                       placeholder="Фамилия"/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Jumbotron className={"border border-danger"} style={{padding: "3% 3%"}}>
                                        <p style={{marginBottom: "0.5rem"}}>Email</p>
                                        <InputGroup>
                                            <Input type="email" name="email" id="email"
                                                   placeholder="Электронная почта сотрудника"
                                                   defaultValue={this.state.userInfo.email}
                                                   onChange={this.changeFields}/>
                                            <InputGroupAddon addonType="append">
                                                <Button outline color="danger" id="password_change" style={{ marginBottom: '1rem' }}>
                                                    Изменить пароль
                                                </Button>
                                            </InputGroupAddon>

                                        </InputGroup>

                                        <ProfileChangePasswordForm userID={this.state.userInfo.iduser} btn_position={"right"}/>
                                            <FormGroup check style={{paddingLeft:0}}>
                                                <Label check >
                                                    <CustomInput defaultChecked={this.state.userInfo.is_superuser}
                                                                 type="switch"
                                                                 id="exampleCustomSwitch" name="customSwitch"
                                                                 onClick={this.changeSuperuserField}
                                                                 label="Администратор в системе" />

                                                </Label>
                                            </FormGroup>
                                    </Jumbotron>
                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"}
                                            {...(this.state.fieldsValidated && this.state.emailValidated) ? {}: {disabled: true}}
                                            onClick={()=>this.changeUserInfo()}>Сохранить изменения</Button>
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
                        first_name: data.data.first_name,
                        last_name: data.data.last_name,
                        email: data.data.email,
                        is_superuser: data.data.is_superuser,
                        contentLoaded: true
                    })
                    console.log(data)
                }).then(()=>this.verifyFields())
                .catch((err) => {
                    console.log('Fetch Error:', err);
                });

        }
    }

}