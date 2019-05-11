import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Alert from "reactstrap/es/Alert";
import TeacherModalEdit from "../TeacherModalEdit";

export default class TeacherInTable extends React.Component {

    constructor(props){
        super(props);

        this.state={
            modalEditOpen: false,
            modalDeleteOpen: false,
            itemDeleteStatusBad: false,
            objectDepartment: 0
        };
        this.getEditDialog = this.getEditDialog.bind(this);
        this.getDeleteDialog = this.getDeleteDialog.bind(this);
    }

    getEditDialog(){
        this.setState(prevState => ({
            modalEditOpen: !prevState.modalEditOpen
        }));
    }
    getDeleteDialog(){
        this.setState(prevState => ({
            modalDeleteOpen: !prevState.modalDeleteOpen
        }));
    }

    deleteItem(){
        console.log("delete item department:");
        fetch('/api/teacher/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'teacher_id':this.props.object.idteacher
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
                    this.setState({
                        itemDeleteStatusBad: true
                    })
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
            <tr>
                <th scope="row">{this.props.object.name}</th>
                <td>{this.state.objectDepartment.name}</td>
                <td className={"text-center"} style={{width: "auto"}}>
                    <Button color="primary" outline size="sm"
                            style={{marginRight: "8px",}}
                            onClick={this.getEditDialog}
                            title={"Редактировать дисциплину "+this.props.object.name}>
                        <FontAwesomeIcon icon="pen" />
                    </Button>
                    <Button color="danger" outline size="sm"
                            onClick={this.getDeleteDialog}
                            {...this.state.curUserIsLoggedIn? {disabled: true}: {}}
                            title={"Удалить дисциплину "+this.props.object.name}>
                        <FontAwesomeIcon icon="trash"/>
                    </Button>
                </td>
                <Modal isOpen={this.state.modalDeleteOpen} toggle={this.getDeleteDialog} style={{minWidth: "40%"}}>
                    <ModalHeader toggle={this.toggle}>Подтвердите действие</ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить преподавателя {this.props.object.name}?
                    </ModalBody>
                    <ModalFooter>
                        {this.state.itemDeleteStatusBad? (<Alert color={"danger"}>Удаление не удалось, что-то пошло не так, обновите страницу</Alert>):(<></>)}
                        <Button color="danger" onClick={()=>{this.deleteItem()}}>Удалить</Button>
                        <Button color="primary" onClick={this.getDeleteDialog}>Отмена</Button>
                    </ModalFooter>
                </Modal>
                <TeacherModalEdit is_open={this.state.modalEditOpen} object={this.props.object} departments={this.props.departments}/>
            </tr>

        );
    }
    componentWillMount() {
        let array = this.props.departments;
        for (let i=0; i < array.length; i++) {
            if (array[i].iddepartment===this.props.object.department_id){
                this.setState({objectDepartment: {id:array[i].iddepartment, name:array[i].initials}})
            }
        }
    }
}