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

export default class DisciplineModalEdit extends React.Component {

    constructor(props){
        super(props);

        this.state={
            isOpenedOut: false,
            isCloseHere: false,
            isOpened: false,
            name: this.props.name,
            semester: this.props.semester,
            department_id: this.props.department_id,
            allowEdit: false,
            hasChanged: false
        };

        this.toggleClose = this.toggleClose.bind(this);
        this.editObject = this.editObject.bind(this);
        this.changeField = this.changeField.bind(this);
    }

    toggleClose(){
        this.setState({isCloseHere: !this.state.isCloseHere})
    }

    isEmptyField = field => field === "" || field===undefined;

    setFieldsToState(e){
        this.setState({[e.target.name]: e.target.value});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }
    verifyFields(){
        if (this.isEmptyField(this.state.name) || this.isEmptyField(this.state.semester) || this.isEmptyField(this.state.department_id) || !this.state.hasChanged) {
            this.setState({
                allowEdit: false
            })
        }
        else {
            this.setState({
                allowEdit: true
            })
        }
    }
    changeField(e){
        this.setFieldsToState(e).then(()=>{
            this.verifyFields()
        })
    }

    renderDepartments(array) {
        const objectsItems = [];

        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].iddepartment} key={array[i].iddepartment}>{array[i].initials}</option>);
        }
        return  objectsItems;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.is_open!==prevProps.is_open || this.state.isCloseHere!==prevState.isCloseHere)
            this.setState({
                isOpened: !!(this.state.isCloseHere^this.props.is_open)
            })
        if ((prevProps.object.name !== this.state.name || prevProps.object.semester !== this.state.semester || prevProps.object.department_id !== this.state.department_id) && !this.state.hasChanged){
            this.setState({
                hasChanged: true
            })
        }

    }

    editObject(){
        fetch('/api/discipline/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'discipline_id':this.props.object.iddiscipline,
                'name':this.state.name,
                'semester':this.state.semester,
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

    render() {
        return (
            <Modal isOpen={this.state.isOpened} style={{minWidth: "50%"}}>
                <ModalHeader>Изменение дисциплины</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="name">Название дисциплины</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={this.props.object.name}
                                onChange={this.changeField}
                                placeholder="Название предмета"
                            />
                        </FormGroup>
                        <Row form>
                            <Col md={5}>
                                <FormGroup>
                                    <Label for="semester">Номер семестра</Label>
                                    <Input type="select"
                                           name="semester"
                                           defaultValue={this.props.object.semester}
                                           onChange={this.changeField}
                                           id="semester">
                                        <option value="">Не выбрано</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                        <option value={11}>11</option>
                                        <option value={12}>12</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="department">Кафедра</Label>
                                    <Input type="select"
                                           name="department_id"
                                           defaultValue={this.props.object.department_id}
                                           onChange={this.changeField}
                                           id="department">
                                        <option value="">Не выбрано</option>
                                        {this.renderDepartments(this.props.departments)}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>

                    <Button color={"primary"}
                            {...this.state.allowEdit? {}:{disabled: true}}
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
            name: this.props.object.name,
            semester: this.props.object.semester,
            department_id: this.props.object.department_id,
        })
    }


    componentDidMount() {
        this.verifyFields()
    }
}