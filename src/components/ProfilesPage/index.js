import React from 'react';
import './style.css'
import Container from "reactstrap/es/Container";
import Table from "reactstrap/es/Table";
import ProfileInList from "./ProfileInList";


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
            userItems.push(<ProfileInList user={users[i]}/>);
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
                            </tr>
                        </thead>

                        <tbody>
                        {this.renderUsers(this.state.users)}
                        </tbody>
                    </Table>
                </div>):(<div><h2>Loading TODO</h2></div>)}
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
                console.log(data);
                this.setState({
                    users: data.data,
                })
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }

}