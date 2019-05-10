import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Page404 extends React.Component {

    constructor(props){
        super(props);

        this.state={

        }

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={"text-center"} style={{paddingTop: "25vh"}}>
                <h1>Я куда-то нажал<br/>и все исчезло<br/><a href={"/"}><FontAwesomeIcon icon="exclamation-triangle" color={"#ff0100"}/></a></h1>
                <p>Ничего не найдено либо недостаточно прав доступа<br/>Ошибка 404</p>
            </div>

        );
    }
}