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
            <div>
                <h1>Ничего не найдено либо недостаточно прав доступа <FontAwesomeIcon icon="times" color={"red"}/></h1>
            </div>

        );
    }
}