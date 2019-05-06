import React from 'react';
import './style.css'
import Container from "reactstrap/es/Container";
import Table from "reactstrap/es/Table";
import ProfileInList from "./ProfileInList";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Button from "reactstrap/es/Button";

//window.location.replace('/profile/new')

export default class ProfilesPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
        }
    }

    componentWillMount() {

    }
    renderUsers(users){
        const userItems = [];
        for (let i=0; i < users.length; i++) {
            userItems.push(<ProfileInList key={users[i].iduser} user={users[i]}/>);
        }
        return userItems;
    }

    render() {
        return (
            <div>
                <Container>
                <h1 className={"text-center"}>Пользователи в системе</h1>
                {this.state.users? (<div>
                    <Table hover borderless className={"text-center"}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Почта</th>
                                <th className={"text-left"}>Действие</th>
                            </tr>
                        </thead>

                        <tbody>
                        {this.renderUsers(this.state.users)}
                        </tbody>
                    </Table>
                    <Row>
                        <Col/>
                        <Col className={"text-center"}>
                            <Button color={"primary"} onClick={()=>{window.location.href = "/profile/new"}}>
                                Добавить пользователя
                            </Button>
                        </Col>
                        <Col/>
                    </Row>
                </div>):(
                    <div className={"text-center"} style={{marginTop: "32px"}}>
                        <h2 >Загрузка списка пользователей</h2>
                        <div className="spinner-border text-primary" role="status" style={{width: "5rem", height: "5rem"}} >
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
                </Container>
            </div>

        );
    }

    componentDidMount() {
        fetch('/api/user/all')
            .then( (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    users: data.data,
                })
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }

}