import React from 'react';
import './style.css'
//import axios from 'axios'


class HomePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            respData: null,
        }

    }

    componentDidMount() {
        fetch('/todo/tasks/1')
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
                    respData: data
                })
            })
            .catch(function(err) {
                console.log('Fetch Error:', err);
            });
    }

    render() {
        console.log(this.state.respData)
        return (
            <div>
                <h1>Стартовая страница Сурдопортала</h1>
                {this.state.respData!==null? (
                    <div>
                        <h1>Данные были успешно загружены</h1>
                        <p>{this.state.respData.data.description}</p>
                    </div>
                ): (
                    <div>печалька</div>
                )}
            </div>

        );
    }
}

export default HomePage;