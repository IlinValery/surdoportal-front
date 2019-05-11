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
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

export default class TeacherModalCreate extends React.Component {

    constructor(props){
        super(props);

        this.state={
            isOpenedOut: false,
            isCloseHere: false,
            isOpened: false,
            name: "",
            department_id: "",
            allowCreate: false

        };

        this.toggleClose = this.toggleClose.bind(this);
        this.createObject = this.createObject.bind(this);
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
        if (this.isEmptyField(this.state.name) || this.isEmptyField(this.state.department_id)) {
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
        this.setFieldsToState(e).then(()=>{this.verifyFields()})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.is_open!==prevProps.is_open || this.state.isCloseHere!==prevState.isCloseHere)
            this.setState({
            isOpened: !!(this.state.isCloseHere^this.props.is_open)
        })
    }

    createObject(table){
        fetch('/api/'+table+'/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'name':this.state.name,
                'department_id':this.state.department_id,
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
    renderDepartments(array) {
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].iddepartment} key={array[i].iddepartment}>{array[i].initials}</option>);
        }
        return  objectsItems;
    }
    render() {
        return (
            <Modal isOpen={this.state.isOpened} style={{minWidth: "50%"}}>
                <ModalHeader>Добавление нового преподавателя</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="name">Имя преподавателя</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                onChange={this.changeField}
                                placeholder="Имя преподавателя"
                            />
                        </FormGroup>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <Label for="department">Кафедра</Label>
                                    <Input type="select"
                                           name="department_id"
                                           onChange={this.changeField}
                                           id="department">
                                        <option value="">Не выбрано</option>
                                        {this.renderDepartments(this.props.departments)}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col/>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color={"primary"}
                            {...this.state.allowCreate? {}:{disabled: true}}
                            onClick={()=>this.createObject('teacher')}>
                        Добавить
                    </Button>
                    <Button {...(this.isEmptyField(this.state.name)&&this.isEmptyField(this.state.semester))? {color: "secondary"}:{color: "danger"}}
                        onClick={this.toggleClose}>Закрыть окно</Button>
                </ModalFooter>
            </Modal>

        );
    }


    componentDidMount() {

    }

}