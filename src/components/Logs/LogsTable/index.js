import React from 'react';
import './style.css'
import Table from "reactstrap/es/Table";
import jwt_decode from "jwt-decode";
import LoadingMessage from "../../Common/LoadingMessage";
import LogInList from "../LogInList";

export default class LogsTable extends React.Component {

    constructor(props){
        super(props);

        this.state={
            logs: null,
            currentLoggedInUser: 0,
            dataLoaded: false

        }

    }

    componentWillMount() {
        const token = localStorage.getItem('usertoken');
        if (token) {
            const decoded = jwt_decode(token);
            this.setState({
                currentLoggedInUser: +decoded.identity.id
            });
        }
    }

    componentDidMount() {
        let link = "";
        if (this.props.admin){
            link = '/api/log/read_all'
            //this.props.max_count
        } else {
            link = '/api/log/read_by_user';
            //this.state.currentLoggedInUser+ +this.props.max_count
        }
        fetch(link, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'count': this.props.max_count,
            })
        }).then( (response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            return response.json();
        }).then((data) => {
            this.setState({logs: data.data, dataLoaded: true})
        }).catch((err) => {
            console.log('Fetch Error:', err);
        });
    }


    renderLogs(logs){
        const userItems = [];
        for (let i=0; i < logs.length; i++) {
            userItems.push(<LogInList key={logs[i].idlog} log={logs[i]}/>);
        }
        return userItems;

    }
    render() {
        return (
            <div>
                {this.state.dataLoaded? (<div>
                        <Table hover borderless className={"text-center"}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Дата</th>
                                <th>Таблица</th>
                                <th>Элемент</th>
                                <th>Пользователь</th>
                                <th>Действие</th>
                            </tr>
                            </thead>

                            <tbody>
                            {this.renderLogs(this.state.logs)}
                            </tbody>
                        </Table>
                </div>):(<LoadingMessage message={"Загрузка журнала"}/>)}
            </div>

        );
    }
}