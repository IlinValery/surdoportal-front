import React from 'react';
import './style.css'
import Container from "reactstrap/es/Container";
import Table from "reactstrap/es/Table";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Button from "reactstrap/es/Button";
import LoadingMessage from "../../Common/LoadingMessage";

export default class DepartmentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            departmentsLoaded: false,
            departments: [],
            dapartmentCreate: false,
        }
        this.addDepartmentToogle = this.addDepartmentToogle.bind(this)
    }

    renderDepartments(array) {
        console.log(array)
    }

    addDepartmentToogle() {
        this.setState({
            dapartmentCreate: !this.state.dapartmentCreate,
        })
        console.log("create!")
    }

    render() {
        return (
            <div>
                <Container>
                    <h1 className={"text-center"}>Кафедры в системе</h1>
                    {this.state.departmentsLoaded ? (<div>
                        <Table hover borderless className={"text-center"}>
                            <thead>
                            <tr>
                                <th>Инициалы</th>
                                <th>Полное название</th>
                                <th>Действие</th>
                            </tr>
                            </thead>

                            <tbody>
                            {this.renderDepartments(this.state.departments)}
                            </tbody>
                        </Table>
                        <Row>
                            <Col/>
                            <Col className={"text-center"}>
                                <Button color={"primary"} onClick={this.addDepartmentToogle}>
                                    Добавить кафедру
                                </Button>
                            </Col>
                            <Col/>
                        </Row>
                    </div>) : (<LoadingMessage message={"Загрузка списка кафедр"}/>)}
                </Container>
            </div>

        );
    }


    componentDidMount() {

    }
}