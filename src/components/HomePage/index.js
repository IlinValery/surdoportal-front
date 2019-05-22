import React from 'react';
import './style.css'
import photo from "./index.jpg"
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

class HomePage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            count_terms: 0,
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
                    count_terms: data.count_terms
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
                <h1 className={"text-center caption-home"}>СУРДОПОРТАЛ</h1>
                <h2 className={"text-center"}>ИНТЕРАКТИВНАЯ БАЗА ТЕРМИНОВ,<br/>ИХ ОПРЕДЕЛЕНИЙ И ЖЕСТОВ</h2>
                <img src={photo} className="img-fluid rounded mx-auto d-block" style={{marginTop: "32px", marginBottom: "32px"}}
                     alt="with enterpreter"/>
                {this.state.count!==0? (
                    <Row>
                        <Col md={4} sm={1}/>
                        <Col className={"home-count-terms"}>
                            <h1 className={"text-center "} style={{marginBottom: 0, fontWeight: "bold"}}>{this.state.count_terms}</h1>
                            <h3 className={"text-center "} style={{marginTop: 0}}>{this.setWordForm(this.state.count_terms)} в системе</h3>
                        </Col>
                        <Col md={4} sm={1}/>
                    </Row>
                ):(<></>)}
            </div>

        );
    }
}

export default HomePage;