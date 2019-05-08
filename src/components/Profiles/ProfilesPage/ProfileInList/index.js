import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ProfileInList extends React.Component {

    constructor(props){
        super(props);

        this.state={
            modal: false
        };
        this.getDialog = this.getDialog.bind(this);
    }

    componentDidMount() {

    }

    editUser(){
        console.log(this.props.email)
    }

    deleteUser(){
        fetch('/api/user/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'usertoken':localStorage.getItem('usertoken'), 'user_id':this.props.user.iduser})
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
                console.log('data:', data);
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

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
                <th scope="row"><a href={'mailto:'+this.props.user.email}>{this.props.user.email}</a></th>
                <td>{this.props.user.first_name}</td>
                <td>{this.props.user.last_name}</td>
                <td>{this.props.user.is_superuser? (<FontAwesomeIcon icon="check" color={"green"} title={"Администратор в системе"}/>):(<FontAwesomeIcon icon="times" color={"red"} title={"Сурдопереводчик"}/>)}</td>
                <td className={"text-center"} style={{width: "auto"}}>
                    <Button color="primary" outline size="sm"
                            style={{marginRight: "8px",}}
                            onClick={()=>{window.location.href = ('/profile/edit/'+this.props.user.iduser)}}
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
                        Вы действительно хотите удалить пользователя<br/>({this.props.user.first_name} {this.props.user.last_name})
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={()=>{this.deleteUser()}}>Удалить</Button>{' '}
                        <Button color="primary" onClick={this.getDialog}>Отмена</Button>
                    </ModalFooter>
                </Modal>
            </tr>

        );
    }
}