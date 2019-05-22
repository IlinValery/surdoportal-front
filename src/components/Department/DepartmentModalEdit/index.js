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

export default class DepartmentModalEdit extends React.Component {

    constructor(props){
        super(props);

        this.state={

            isOpenedOut: false,
            isCloseHere: false,
            isOpened: false,
            initials: "",
            caption: "",
            allowCreate: false,
            hasChanged: false

        };

        this.toggleClose = this.toggleClose.bind(this);
        this.editObject = this.editObject.bind(this);
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
    verifyFields(){
        if (this.isEmptyField(this.state.initials) || this.isEmptyField(this.state.caption) || !this.state.hasChanged) {
            this.setState({
                allowCreate: false
            })
        }
        else {
            this.setState({
                allowCreate: true
            })
        }
    }
    changeField(e){
        this.setFieldsToState(e).then(()=>{
            this.verifyFields()
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.is_open!==prevProps.is_open || this.state.isCloseHere!==prevState.isCloseHere)
            this.setState({
                isOpened: !!(this.state.isCloseHere^this.props.is_open)
            })
        if ((prevProps.object.initials !== this.state.initials || prevProps.object.caption !== this.state.caption) && !this.state.hasChanged){
            this.setState({
                hasChanged: true
            })
        }

    }

    editObject(){
        fetch('/api/department/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'department_id': this.props.object.iddepartment,
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
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpened} style={{minWidth: "50%"}}>
                <ModalHeader>Изменение кафедры</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="initials">Инициалы</Label>
                            <Input
                                type="text"
                                name="initials"
                                id="initials"
                                defaultValue={this.props.object.initials}
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
                                defaultValue={this.props.object.caption}
                                onChange={this.changeField}
                                placeholder="Длинное название"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>

                    <Button color={"primary"}
                            {...this.state.allowCreate? {}:{disabled: true}}
                            onClick={this.editObject}>
                        Изменить
                    </Button>
                    <Button {...this.state.hasChanged? {color: "danger"}:{color: "secondary"}}
                            onClick={this.toggleClose}>Закрыть окно</Button>
                </ModalFooter>
            </Modal>

        );
    }

    componentWillMount() {
        this.setState({
            initials: this.props.object.initials,
            caption: this.props.object.caption,
        })
    }

    componentDidMount() {
        this.verifyFields()
    }
}