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
            count: 0,
        }

    }

    componentDidMount() {
        fetch('/api/term/count')
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
                    count: data.count
                });
                console.log(data)
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }
    setWordForm(count){
        let str = ""
        if (count<5 || count>20){
            if (count%10===1){str="термин"}
            else if (count%10>1 && count%10<5){str="термина"}
            else {str="терминов"}
        } else {str = "терминов"}
        return str
    }
    render() {
        return (
            <div className={"home-page-container"}>
                <h1 className={"text-center"}>СУРДОПОРТАЛ</h1>
                <h2 className={"text-center"}>ИНТЕРАКТИВНАЯ БАЗА ТЕРМИНОВ,<br/>ИХ ОПРЕДЕЛЕНИЙ И ЖЕСТОВ</h2>
                <Container>
                    <img src={photo} className="img-fluid rounded mx-auto d-block" alt="with enterpreter"/>
                    {this.state.count!==0? (
                        <Row>
                            <Col/>
                            <Col className={"home-count-terms"}>
                                <h2 className={"text-center "} style={{marginBottom: 0, fontWeight: "bold"}}>{this.state.count}</h2>
                                <h3 className={"text-center "} style={{marginTop: 0}}>{this.setWordForm(this.state.count)} в системе</h3>
                            </Col>
                            <Col/>
                        </Row>
                    ):(<></>)}
                </Container>
            </div>

        );
    }
}

export default HomePage;