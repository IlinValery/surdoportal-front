import React from 'react';
import './style.css'
import UncontrolledCollapse from "reactstrap/es/UncontrolledCollapse";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";
import FormFeedback from "reactstrap/es/FormFeedback";
import Button from "reactstrap/es/Button";

export default class ProfileChangePasswordForm extends React.Component {

    constructor(props){
        super(props);
        this.state={
            currentUser: 0,
            buttonPosition: "left",
            password: "",
            confirm_password: "",
            passwordValidated: false,
            passwordWasChanged: false,
            serverEditStatus: -1
        }

        this.changePassword = this.changePassword.bind(this);

    }

    isEmptyField = field => field === "";

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

    componentDidMount() {
        this.setState({
            currentUser: this.props.userID,
            buttonPosition: this.props.btn_position
        })
    }

    changePasswordButton(){
        console.log("change_password for", this.state.currentUser)
    }


    render() {
        return (
            <div>
                <UncontrolledCollapse toggler="password_change">
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="password">Новый пароль</Label>
                                <Input type="password" name="password"
                                       onChange={this.changePassword}
                                       {...this.state.password.length>0 ? {...this.state.password.length<8 ? {invalid: true}: {valid:true}}: {}}
                                       id="password" placeholder="Пароль"/>
                                <FormFeedback invalid={"true"}>Пароль должен содержать более 8 символов!</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup >
                                <Label for="conf_password">Подтвердите пароль</Label>
                                <Input type="password" name="confirm_password"
                                       id="conf_password"
                                       onChange={this.changePassword}
                                       {...this.state.confirm_password.length>0 ? {...this.state.password.length!==this.state.confirm_password.length ? {invalid: true}: {valid:true}}: {}}
                                       placeholder="Подтвердите пароль"/>
                                <FormFeedback invalid={"true"}>Пароли должны совпадать!</FormFeedback>

                            </FormGroup>
                        </Col>
                    </Row>
                    <Col className={"text-"+this.state.buttonPosition} style={{padding:0}}>
                        <Button  color={"danger"}
                                {...(this.state.passwordWasChanged && this.state.passwordValidated) ? {}: {disabled: true}}
                                onClick={()=>this.changePasswordButton()}>Сохранить пароль</Button>
                    </Col>
                </UncontrolledCollapse>
            </div>

        );
    }
}