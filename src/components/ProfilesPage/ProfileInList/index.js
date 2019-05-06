import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from "reactstrap/es/Button";

export default class ProfileInList extends React.Component {

    constructor(props){
        super(props);

        this.state={

        }

    }

    componentDidMount() {

    }

    chooseUser(){
        console.log(this.props.email)
    }
    render() {
        return (
            <tr>
                <th scope="row">{this.props.user.iduser}</th>
                <td>{this.props.user.first_name}</td>
                <td>{this.props.user.second_name}</td>
                <td>{this.props.user.email}</td>
                <td>
                    <Button color="primary" outline size="sm">
                        <FontAwesomeIcon icon="ellipsis-v"/>
                    </Button>
                </td>

            </tr>

        );
    }
}