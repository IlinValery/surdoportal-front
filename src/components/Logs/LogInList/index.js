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
            popoverElementId: 0
        }

    }

    twoDigits(d) {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
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
                <td><Button id={this.state.popoverElementId} color={"link"} onClick={()=>this.tooglePopoverElement()} style={{paddingTop:0,paddingBottom:0}}>{this.props.log.element}</Button></td>
                <td {...this.props.admin? {}:{style: {display: "none"}}}><Button id={this.state.popoverUserId} color={"link"} onClick={()=>this.tooglePopoverUser()} style={{paddingTop:0,paddingBottom:0}}>{this.props.log.user}</Button></td>
                <td>{this.returnAction(this.props.log.action)}</td>
                <Popover trigger="legacy" isOpen={this.state.popoverElementOpen} target={this.state.popoverElementId} placement="bottom">
                    {this.state.isLoadedElement? (<PopoverBody>{this.returnElementInfo(this.state.elementInfo)}</PopoverBody>):(<PopoverBody>Вероятно объект удален</PopoverBody>)}
                </Popover>
                <Popover trigger="legacy" isOpen={this.state.popoverUserOpen} target={this.state.popoverUserId} placement="bottom">
                    {this.state.currentLoggedInUser===this.props.log.user? (<PopoverBody className={"text-center"}>Это вы!</PopoverBody>):(
                        <div>{this.state.isLoadedUser? (<PopoverBody>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</PopoverBody>):(<PopoverBody className={"text-center"}>Пользователь удален</PopoverBody>)}</div>
                    )}
                </Popover>
            </tr>


        );
    }

    componentDidMount() {
        let linkUser = '/api/user/'+this.props.log.user;
        let linkElement = '/api/'+this.props.log.table+'/'+this.props.log.element;
        let timeout = Math.random()*(2000);
        //for user:
        if (this.state.currentLoggedInUser!==this.props.log.user){
            setTimeout(()=>{
                fetch(linkUser)
                    .then((response) => {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            return;
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.data!==null) {
                            this.setState({
                                userInfo: data.data,
                                isLoadedUser: true
                            });
                        }
                    })
                    .catch((err) => {
                        console.log('Fetch Error:', err);
                    });
            },timeout);
        }
        //for elements
        setTimeout(()=>{
            fetch(linkElement)
                .then((response) => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    return response.json();
                })
                .then((data) => {

                    if (data.data!==null) {
                        if (this.props.log.table==="user") {
                            let user = {first_name: data.data.first_name, last_name: data.data.last_name};
                            this.setState({
                                elementInfo: user,
                                isLoadedElement: true
                            })
                        } else  if (this.props.log.table==="department") {
                            let department = {initials: data.data.initials};
                            this.setState({
                                elementInfo: department,
                                isLoadedElement: true
                            })
                        }
                    }
                })
                .catch((err) => {
                    console.log('Fetch Error:', err);
                });
        },timeout*2);
    }
}