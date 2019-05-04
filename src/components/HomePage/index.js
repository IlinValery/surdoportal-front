import React from 'react';
import './style.css'
import photo from "./index.jpg"
import Container from "reactstrap/es/Container";

class HomePage extends React.Component {

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
                <h1 className={"text-center"}>Добро пожаловать на Сурдопортал</h1>
                <Container>
                    <img src={photo} className="img-fluid rounded mx-auto d-block" alt="with enterpreter"/>
                </Container>
                {this.state.connectionSuccessful? (
                    <div>
                        <h6>Соединение с сервером установлено</h6>
                    </div>
                ): (
                    <div>Соединение с сервером отсутствует</div>
                )}

            </div>

        );
    }
}

export default HomePage;