import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Alert from "reactstrap/es/Alert";
import Popover from "reactstrap/es/Popover";
import PopoverBody from "reactstrap/es/PopoverBody";
//import TeacherModalEdit from "../TeacherModalEdit";

export default class TermInTable extends React.Component {

    constructor(props){
        super(props);

        this.state={
            modalDeleteOpen: false,
            itemDeleteStatusBad: false,
            isSuperuser: false,
            date: 0,
            objectDepartment: 0,
            popoverUserOpen: false,
            popoverUserId: 0,
        };
        this.getEditPage = this.getEditPage.bind(this);
        this.getDeleteDialog = this.getDeleteDialog.bind(this);
    }

    getEditPage(){
        window.location.href = "/terms/editor/"+this.props.object.idterm;
    }
    getDeleteDialog(){
        this.setState(prevState => ({
            modalDeleteOpen: !prevState.modalDeleteOpen
        }));
    }

    deleteItem(){
        console.log("delete item term:");
        fetch('/api/term/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'term_id':this.props.object.idterm
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

    renderDate(date_source){
        let date = new Date(date_source);
        let str_date = ("0" + (date.getDate() + 1)).slice(-2)+"/"+("0" + (date.getMonth() + 1)).slice(-2)+"/"+
            date.getFullYear() + " " + ("0" + (date.getHours()+date.getTimezoneOffset()/60)).slice(-2)+":"+("0" + (date.getMinutes() + 1)).slice(-2);
        return str_date
    }


    tooglePopoverUser(){
        this.setState({
            popoverUserOpen: !this.state.popoverUserOpen
        });
    }
    render() {
        return (
            <tr>
                <th scope="row" className={"table-text"}>{this.props.object.caption}</th>
                <td>{this.props.object.discipline.name}</td>
                {this.props.only_invalided? (<></>):(
                    <td>
                        {this.props.object.is_shown? (
                            <FontAwesomeIcon icon="check" color={"green"} title={"Утвержден"}/>
                        ):(
                            <FontAwesomeIcon icon="times" color={"red"} title={"Не утвержден"}/>
                        )}
                    </td>
                )}
                {this.props.is_superuser? (<td>
                    <Button id={"user"+this.props.elem_number} color={"link"} onClick={()=>this.tooglePopoverUser()} style={{paddingTop:0,paddingBottom:0}}>
                    {this.props.object.creator.email}
                    </Button>
                    <Popover trigger="legacy" isOpen={this.state.popoverUserOpen} target={"user"+this.props.elem_number} placement="bottom">
                        <PopoverBody>{this.props.object.creator.first_name} {this.props.object.creator.last_name}</PopoverBody>
                    </Popover>
                </td>):(<></>)}

                <td>{this.renderDate(this.props.object.changed)}</td>
                <td className={"text-center"} style={{width: "auto"}}>
                    <Button color="primary" outline size="sm"
                            style={{marginRight: "8px",}}
                            onClick={this.getEditPage}
                            title={"Редактировать термин "+this.props.object.caption}>
                        <FontAwesomeIcon icon="pen" />
                    </Button>
                    {this.props.is_superuser? (
                        <Button color="danger" outline size="sm"
                                onClick={this.getDeleteDialog}
                                title={"Удалить термин "+this.props.object.caption}>
                            <FontAwesomeIcon icon="trash"/>
                        </Button>
                    ):(<></>)}

                </td>
                <Modal isOpen={this.state.modalDeleteOpen} toggle={this.getDeleteDialog} style={{minWidth: "40%"}}>
                    <ModalHeader toggle={this.toggle}>Подтвердите действие</ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить термин {this.props.object.caption}?
                    </ModalBody>
                    <ModalFooter>
                        {this.state.itemDeleteStatusBad? (<Alert color={"danger"}>Удаление не удалось, что-то пошло не так, обновите страницу</Alert>):(<></>)}
                        <Button color="danger" onClick={()=>{this.deleteItem()}}>Удалить</Button>
                        <Button color="primary" onClick={this.getDeleteDialog}>Отмена</Button>
                    </ModalFooter>
                </Modal>
            </tr>

        );
    }
}