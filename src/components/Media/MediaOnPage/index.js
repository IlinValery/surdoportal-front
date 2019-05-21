import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import React from 'react';
import './style.css'

export default class MediaOnPage extends React.Component {

    constructor(props){
        super(props);

        this.state={

        }
        this.types = {
            1: "Жест",
            2: "Артикуляция",
            3: "Пример"
        }

    }
    getComponentName(type_number){

        return this.types[type_number]
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <Row style={{marginTop: "16px"}}>
                    <Col md={2}/>
                    <Col>
                        <h6>{this.getComponentName(this.props.media.type)}:</h6>
                        <div className="embed-responsive embed-responsive-16by9" >
                            <iframe title={this.getComponentName(this.props.media.type)} className="embed-responsive-item"
                                    src={"https://www.youtube.com/embed/"+this.props.media.youtube_id+"?autoplay=0&showinfo=0&controls=0&iv_load_policy=1"}></iframe>
                        </div>
                    </Col>
                    <Col md={2}/>

                </Row>

            </div>

        );
    }
}