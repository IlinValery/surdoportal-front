import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ProfileInList extends React.Component {

    constructor(props){
        super(props);

        this.state={
            modal: false

        }
        this.getDialog = this.getDialog.bind(this);

    }

    componentDidMount() {

    }

    editUser(){
        console.log(this.props.email)
    }

    deleteUser(){
        window.location.reload()
    }

    getDialog(){
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.user.iduser}</th>
                <td>{this.props.user.first_name}</td>
                <td>{this.props.user.second_name}</td>
                <td>{this.props.user.email}</td>
                <td className={"text-left"} style={{width: "auto"}}>
                    <Button color="primary" outline size="sm"
                            style={{marginRight: "8px",}}
                            onClick={()=>{window.location.replace('/profile/edit/'+this.props.user.iduser)}}
                            title={"Редактировать пользователя "+this.props.user.email}>
                        <FontAwesomeIcon icon="pen" />
                    </Button>
                    <Button color="danger" outline size="sm"
                            onClick={() => this.getDialog()}
                            title={"Удалить пользователя "+this.props.user.email}>
                        <FontAwesomeIcon icon="trash"/>
                    </Button>
                </td>
                <Modal isOpen={this.state.modal} toggle={this.getDialog} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Подтвердите действие</ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить пользователя<br/>({this.props.user.first_name} {this.props.user.second_name})
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteUser}>Удалить</Button>{' '}
                        <Button color="primary" onClick={this.getDialog}>Отмена</Button>
                    </ModalFooter>
                </Modal>
            </tr>

        );
    }
}