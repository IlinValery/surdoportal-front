import React from 'react';
import './style.css'
import LoadingMessage from "../../Common/LoadingMessage";

export default class ProfileCreateEditPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            userID: undefined

        }

    }

    componentDidMount() {
        this.setState({
            userID: parseInt(this.props.match.params.number, 10)
        })
    }

    render() {
        console.log(this.state.userID);

        return (
            <div>
            {this.state.userID===undefined? (<LoadingMessage message={"Идет загрузка, подождите"}/>):(
                    <div>
                        <h1>Page for edit/new user</h1>
                    </div>
                )}
            </div>
        );
    }
}