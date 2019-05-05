import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Footer extends React.Component {

    constructor(props){
        super(props);

        this.state={
            respData: null,
            connectionSuccessful: false
        }

    }

    componentDidMount() {
        fetch('/api/test_connection_with_server')
            .then( (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                } else {this.setState({connectionSuccessful:true})}
                return response.json();
            })
            .then((data) => {
                this.setState({
                    respData: data
                })
            })
            .catch((err) => {
                this.setState({
                    respData: null
                });

                console.log('Fetch Error:', err);
            });

    }

    render() {
        return (
            <div>
                <footer className={"footer-sticky"}>

                    <div className={"row"}>
                        <div className={"col-sm-6 text-left"}>
                            {this.state.connectionSuccessful? (
                                <div>
                                    Состояние системы: <FontAwesomeIcon icon="stroopwafel" color={"green"} title={"Соединение с сервером установлено"}/>
                                </div>
                            ): (
                                <div>
                                    Состояние системы: <FontAwesomeIcon icon="stroopwafel" color={"red"} title={"Соединение с сервером отсутствует"}/>
                                </div>
                            )}

                        </div>
                        <div className={"col-sm-6 text-right support-contact"}>
                            <a href="https://github.com/IlinValery">© Ilin Valery</a>
                        </div>

                    </div>


                </footer>
            </div>

        );
    }
}
//times or check