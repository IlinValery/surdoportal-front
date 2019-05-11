import React from 'react';
import './style.css'
import Container from "reactstrap/es/Container";
import LogsTable from "../LogsTable";

export default class LogsPage extends React.Component {

    constructor(props){
        super(props);

        this.state={

        }

    }

    render() {
        return (
            <div>
                <Container>
                    <h1 className={"text-center"}>Журнал последних действий</h1>
                    <LogsTable admin={true} max_count={20}/>
                </Container>
            </div>

        );
    }
}