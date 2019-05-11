import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Alert from "reactstrap/es/Alert";
import DepartmentModalEdit from "../DepartmentModalEdit";

export default class DepartmentInTable extends React.Component {

    constructor(props){
        super(props);

        this.state={
            modalEditOpen: false,
            modalDeleteOpen: false,
            itemDeleteStatusBad: false
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
        fetch('/api/department/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'usertoken':localStorage.getItem('usertoken'), 'department_id':this.props.department.iddepartment})
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
                <th scope="row">{this.props.department.initials}</th>
                <td>{this.props.department.caption}</td>
                <td className={"text-center"} style={{width: "auto"}}>
                    <Button color="primary" outline size="sm"
                            style={{marginRight: "8px",}}
                            onClick={this.getEditDialog}
                            title={"Редактировать кафедру "+this.props.department.initials}>
                        <FontAwesomeIcon icon="pen" />
                    </Button>
                    <Button color="danger" outline size="sm"
                            onClick={this.getDeleteDialog}
                            {...this.state.curUserIsLoggedIn? {disabled: true}: {}}
                            title={"Удалить кафедру "+this.props.department.initials}>
                        <FontAwesomeIcon icon="trash"/>
                    </Button>
                </td>
                <Modal isOpen={this.state.modalDeleteOpen} toggle={this.getDeleteDialog} style={{minWidth: "40%"}}>
                    <ModalHeader toggle={this.toggle}>Подтвердите действие</ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить кафедру {this.props.department.initials}?<br/>({this.props.department.caption})
                    </ModalBody>
                    <ModalFooter>
                        {this.state.itemDeleteStatusBad? (<Alert color={"danger"}>Удаление не удалось, что-то пошло не так, обновите страницу</Alert>):(<></>)}
                        <Button color="danger" onClick={()=>{this.deleteItem()}}>Удалить</Button>
                        <Button color="primary" onClick={this.getDeleteDialog}>Отмена</Button>
                    </ModalFooter>
                </Modal>
                <DepartmentModalEdit is_open={this.state.modalEditOpen} object={this.props.department}/>
            </tr>

        );
    }
}