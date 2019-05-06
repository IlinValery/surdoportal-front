import React from 'react';
import './style.css'
import LoadingMessage from "../../Common/LoadingMessage";

export default class ProfileCreateEditPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            userID: undefined,
            isFromForEdit: false

        }

    }

    componentWillMount() {
        let u_id = parseInt(this.props.match.params.number, 10)
        this.setState({
            userID: u_id,
            isFromForEdit: u_id>0
        })
    }

    render() {
        return (
            <div>
            {this.state.userID===undefined? (<LoadingMessage message={"Идет загрузка контента, подождите"}/>):(
                    <div>
                        <h1>Page for edit/new user</h1>
                    </div>
                )}
            </div>
        );
    }

    componentDidMount() {
        if (this.state.isFromForEdit){
            console.log("edit")
        }
    }

}