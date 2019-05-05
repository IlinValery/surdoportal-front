import React from 'react';
import './style.css'


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
            userItems.push(<h1>{users[i].email}</h1>);
        }
        return userItems;
    }
    render() {
        return (
            <div>
                <h1>Пользователи в системе</h1>
                {this.state.users? (<div>
                    {this.renderUsers(this.state.users)}
                </div>):(<div></div>)}
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