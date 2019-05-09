import React from 'react';
import './style.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class LogInList extends React.Component {

    constructor(props){
        super(props);

        this.state={
            date: Date()
        }

    }

    twoDigits(d) {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
    }

    componentWillMount() {

    }

    returnTableName(table){
        let name ="";
        if (table==="user"){ name = "Пользователь"}
        else if (table==="department"){ name = "Кафедра"}
        return name
    }

    returnAction(action){
        if (action==="add"){ return (<FontAwesomeIcon icon={"plus"} color={"green"} title={"Добавлен"}/>)}
        else if (action==="delete"){ return (<FontAwesomeIcon icon={"minus"} color={"red"} title={"Удален"}/>)}
        else if (action==="edit_password"){ return (<FontAwesomeIcon icon={"key"} title={"Изменен пароль"} color={"#ff785d"}/>)}
        else { return (<FontAwesomeIcon icon={"pen"} title={"Изменен"} color={"orange"}/>)}
    }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.log.idlog}</th>
                <td>{this.props.log.date_time}</td>
                <td>{this.returnTableName(this.props.log.table)}</td>
                <td>{this.props.log.element}</td>
                <td>{this.props.log.user}</td>
                <td>{this.returnAction(this.props.log.action)}</td>
            </tr>

        );
    }

    componentDidMount() {

    }
}