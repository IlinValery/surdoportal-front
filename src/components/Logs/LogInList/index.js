import React from 'react';
import './style.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import PopoverBody from "reactstrap/es/PopoverBody";
import Button from "reactstrap/es/Button";
import Popover from "reactstrap/es/Popover";

export default class LogInList extends React.Component {

    constructor(props){
        super(props);

        this.state={
            date: Date(),
            currentLoggedInUser: 0,
            isLoadedElement: false,
            isLoadedUser:false,
            userInfo: null,
            elementInfo: null,
            popoverUserOpen: false,
            popoverElementOpen: false,
            popoverUserId: 0,
            popoverElementId: 0,
            userLogID: 0,
            elementLogID: 0
        }

    }

    tooglePopoverUser(){
        this.setState({
            popoverUserOpen: !this.state.popoverUserOpen
        });
    }
    tooglePopoverElement(){
        this.setState({
            popoverElementOpen: !this.state.popoverElementOpen
        });
    }
    componentWillMount() {
        this.setState({
            popoverUserId: "user_"+this.props.log.idlog,
            popoverElementId: "elem_"+this.props.log.idlog

        })
        const token = localStorage.getItem('usertoken');
        if (token) {
            const decoded = jwt_decode(token);

            this.setState({
                currentLoggedInUser: +decoded.identity.id
            });
        }
        if (Object.keys(this.props.log.user).length>1) {
            this.setState({
                userLogID: this.props.log.user.iduser
            })
        } else {
            this.setState({
                userLogID: this.props.log.user
            })
        }
    }

    returnTableName(table){
        let name ="";
        if (table==="user"){ name = "Пользователь"}
        else if (table==="department"){ name = "Кафедра"}
        else if (table==="discipline"){ name = "Дисциплина"}
        else if (table==="teacher"){ name = "Преподаватель"}
        else if (table==="term"){ name = "Термин"}
        else if (table==="media"){ name = "Видеофайл"}
        return name
    }

    returnAction(action){ //TODO FOR TERM
        console.log(action)
        if (action==="add"){ return (<FontAwesomeIcon icon={"plus"} color={"green"} title={"Добавлен"}/>)}
        else if (action==="delete"){ return (<FontAwesomeIcon icon={"minus"} color={"red"} title={"Удален"}/>)}
        else if (action==="edit_password"){ return (<FontAwesomeIcon icon={"key"} title={"Изменен пароль"} color={"#ff785d"}/>)}
        else if (action==="validate_1"){ return (<FontAwesomeIcon icon={"check"} title={"Термин утвержден"} color={"green"}/>)}
        else if (action==="validate_0"){ return (<FontAwesomeIcon icon={"times"} title={"Термин снят с утверждения"} color={"red"}/>)}
        else { return (<FontAwesomeIcon icon={"pen"} title={"Изменен"} color={"orange"}/>)}
    }
    returnElementInfo(element){
        let res = "";
        for (let property in element){
            if(element.hasOwnProperty(property))
            {
                res+=element[property]+" ";
            }

        }
        return res
    }
    render() {
        return (
            <tr
                {...(this.state.currentLoggedInUser===this.props.log.user) ? {...this.props.admin? {className: "is-auth-user"}:{}}: {}}
            >
                <th scope="row">{this.props.log.idlog}</th>
                <td>{this.props.log.date_time}</td>
                <td>{this.returnTableName(this.props.log.table)}</td>
                <td>
                    <Button id={this.state.popoverElementId} color={"link"} onClick={()=>this.tooglePopoverElement()}
                            style={{paddingTop:0,paddingBottom:0}}>
                        {Object.keys(this.props.log.element).length>1? (
                            <FontAwesomeIcon icon={"book"} title={"ID объекта "+this.props.log.element.id}/>
                        ):(
                            <FontAwesomeIcon icon={"trash"} title={"ID объекта "+this.props.log.element}/>
                        )}
                    </Button></td>
                <td {...this.props.admin? {}:{style: {display: "none"}}}>
                    <Button id={this.state.popoverUserId} color={"link"} onClick={()=>this.tooglePopoverUser()} style={{paddingTop:0,paddingBottom:0}}>
                        {Object.keys(this.props.log.user).length>1? (<FontAwesomeIcon icon={"user"} title={"ID пользователя "+this.props.log.user.iduser}/>):(<FontAwesomeIcon icon={"user-slash"} title={"ID пользователя "+this.props.log.user}/>)}
                    </Button>
                </td>
                <td>{this.returnAction(this.props.log.action)}</td>



                <Popover trigger="legacy" isOpen={this.state.popoverElementOpen} target={this.state.popoverElementId} placement="bottom">
                    {Object.keys(this.props.log.element).length>1? (
                        <PopoverBody>
                            {this.props.log.element.text} (ID: {this.props.log.element.id})
                        </PopoverBody>
                    ):(
                        <PopoverBody className={"text-center"}>
                            Объект удален (ID: {this.props.log.element})
                        </PopoverBody>)}

                </Popover>

                <Popover trigger="legacy" isOpen={this.state.popoverUserOpen} target={this.state.popoverUserId} placement="bottom">

                    {this.state.currentLoggedInUser===this.state.userLogID? (<PopoverBody className={"text-center"}>Это вы!</PopoverBody>):(
                        <div>
                            {Object.keys(this.props.log.user).length>1? (
                                <PopoverBody>
                                    {this.props.log.user.first_name} {this.props.log.user.last_name}
                                </PopoverBody>
                            ):(
                                <PopoverBody className={"text-center"}>
                                    Пользователь удален
                                </PopoverBody>)}
                        </div>
                    )}
                </Popover>
            </tr>


        );
    }

    componentDidMount() {

    }
}