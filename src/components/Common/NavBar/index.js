import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

import './style.css'
import logo from './logo.svg'
import jwt_decode from "jwt-decode";

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            isLogined: false,
            first_name: '',
            last_name: '',
            isSuperuser: false,
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logout(){
        localStorage.removeItem('usertoken');
        window.location.replace('/')
    }


    componentWillMount() {
        const token = localStorage.getItem('usertoken');
        if (token!==undefined){
            try {
                jwt_decode(token);
            } catch (err) {
                localStorage.clear();
            }
        }
    }

    render() {
        return (
            <div>
                <Navbar color="light" light fixed="top" expand="md">
                    <NavbarBrand href="/">
                        <img src={logo} className="d-inline-block align-top" style={{height:35, width:40, marginRight: 10}} alt="surdoportal logo" />
                        Сурдопортал
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/terms">Все термины</NavLink>
                            </NavItem>
                            {!this.state.isLogined? (
                                <NavItem>
                                    <NavLink href="/login">Вход</NavLink>
                                </NavItem>
                            ):(
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Администрирование
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={() => {window.location.href = '/profile/me'}}>
                                            Профиль {this.state.first_name} {this.state.last_name}
                                        </DropdownItem>

                                        <DropdownItem onClick={() => {window.location.href = '/terms/editor'}}>
                                            Управление терминами
                                        </DropdownItem>

                                        {this.state.isSuperuser? (
                                            <div>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => {window.location.href ='/admin/departments'}}>
                                                    Управление кафедрами
                                                </DropdownItem>
                                                <DropdownItem onClick={() => {window.location.href ='/admin/disciplines'}}>
                                                    Управление дисциплинами
                                                </DropdownItem>
                                                <DropdownItem onClick={() => {window.location.href ='/admin/teachers'}}>
                                                    Управление преподавателями
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={() => {window.location.href ='/profile/all'}}>
                                                    Управление пользователями
                                                </DropdownItem>
                                                <DropdownItem onClick={() => {window.location.href ='/admin/logs'}}>
                                                    Журнал действий
                                                </DropdownItem>
                                            </div>
                                        ):(
                                            <div></div>
                                        )}
                                        <DropdownItem divider />
                                        <DropdownItem onClick={()=>this.logout()}>
                                            Выход
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }

    componentDidMount() {
        const token = localStorage.getItem('usertoken');
        if (token){
            this.setState({isLogined: true});
            const decoded = jwt_decode(token);
            this.setState({
                first_name: decoded.identity.first_name,
                last_name: decoded.identity.last_name,
                isSuperuser: decoded.identity.is_superuser===1,

            })
        }

    }

}