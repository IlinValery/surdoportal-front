import React from 'react';
import './style.css'
import Modal from "reactstrap/es/Modal";
import ModalHeader from "reactstrap/es/ModalHeader";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";

export default class DepartmentModalCreate extends React.Component {

    constructor(props){
        super(props);

        this.state={
            isOpenedOut: false,
            isCloseHere: false,
            isOpened: false,
            initials: "",
            caption: "",
            allowCreate: false

        };

        this.toggleClose = this.toggleClose.bind(this);
        this.createDepartment = this.createDepartment.bind(this);
        this.changeField = this.changeField.bind(this);
    }

    toggleClose(){
        this.setState({isCloseHere: !this.state.isCloseHere})
    }

    isEmptyField = field => field === "";

    setFieldsToState(e){
        this.setState({[e.target.name]: e.target.value});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }

    changeField(e){
        this.setFieldsToState(e).then(()=>{
            if (this.isEmptyField(this.state.initials) || this.isEmptyField(this.state.caption)) {
                this.setState({
                    allowCreate: false
                })
            }
            else {
                this.setState({
                    allowCreate: true
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.is_open!==prevProps.is_open || this.state.isCloseHere!==prevState.isCloseHere)
            this.setState({
            isOpened: !!(this.state.isCloseHere^this.props.is_open)
        })
    }

    createDepartment(){
        fetch('/api/department/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'initials':this.state.initials,
                'caption':this.state.caption,
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
                    console.log(data)
                } else {
                    window.location.reload()
                }
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
        //this.setState({isCloseHere: !this.state.isCloseHere})

    }

    render() {
        return (
            <Modal isOpen={this.state.isOpened} style={{minWidth: "50%"}}>
                <ModalHeader>Добавление новой кафедры</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="initials">Инициалы</Label>
                            <Input
                                type="text"
                                name="initials"
                                id="initials"
                                onChange={this.changeField}
                                placeholder="Инициалы"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="caption">Полное название</Label>
                            <Input
                                type="text"
                                name="caption"
                                id="caption"
                                onChange={this.changeField}
                                placeholder="Длинное название"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color={"primary"}
                            {...this.state.allowCreate? {}:{disabled: true}}
                            onClick={this.createDepartment}>
                        Добавить
                    </Button>
                    <Button {...(this.isEmptyField(this.state.initials)&&this.isEmptyField(this.state.caption))? {color: "secondary"}:{color: "danger"}}
                        onClick={this.toggleClose}>Закрыть окно</Button>
                </ModalFooter>
            </Modal>

        );
    }


    componentDidMount() {

    }

}