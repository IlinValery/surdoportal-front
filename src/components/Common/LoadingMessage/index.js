import React from 'react';
import './style.css'

export default class LoadingMessage extends React.Component {

    render() {
        return (
            <div className={"text-center"} style={{marginTop: "32px"}}>
                <h2 >{this.props.message}</h2>
                <div className="spinner-border text-primary" role="status" style={{width: "5rem", height: "5rem"}} >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}