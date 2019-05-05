import React from 'react';
import './style.css'
import photo from "./index.jpg"
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

class HomePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
        }

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={"home-page-container"}>
                <h1 className={"text-center"}>СУРДОПОРТАЛ</h1>
                <h2 className={"text-center"}>ИНТЕРАКТИВНАЯ БАЗА ТЕРМИНОВ,<br/>ИХ ОПРЕДЕЛЕНИЙ И ЖЕСТОВ</h2>
                <Container>
                    <img src={photo} className="img-fluid rounded mx-auto d-block" alt="with enterpreter"/>
                </Container>
                <Container>
                    <Row>
                        <Col/>
                        <Col className={"home-count-terms"}>
                            <h2 className={"text-center "} style={{marginBottom: 0, fontWeight: "bold"}}>TODO</h2>
                            <h3 className={"text-center "} style={{marginTop: 0}}>терминов представлено в системе</h3>
                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>

        );
    }
}

export default HomePage;