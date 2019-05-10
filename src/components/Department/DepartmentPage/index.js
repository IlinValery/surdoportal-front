import React from 'react';
import './style.css'
import Container from "reactstrap/es/Container";
import Table from "reactstrap/es/Table";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Button from "reactstrap/es/Button";
import LoadingMessage from "../../Common/LoadingMessage";
import DepartmentModalCreate from "../DepartmentModalCreate";
import DepartmentInTable from "../DepartmentInTable";

export default class DepartmentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            departmentsLoaded: false,
            departments: [],
            departmentCreate: false,
        }
        this.addDepartmentToggle = this.addDepartmentToggle.bind(this)
        this.renderedDepartments = []
    }

    renderDepartments(array) {
        const departmentItems = [];
        for (let i=0; i < array.length; i++) {
            departmentItems.push(<DepartmentInTable key={array[i].iddepartment} department={array[i]}/>);
        }
        return  departmentItems;
    }

    addDepartmentToggle() {
        this.setState({
            departmentCreate: !this.state.departmentCreate,
        })
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
                                <Button color={"primary"} onClick={this.addDepartmentToggle}>
                                    Добавить кафедру
                                </Button>
                            </Col>
                            <Col/>
                        </Row>
                    </div>) : (<LoadingMessage message={"Загрузка списка кафедр"}/>)}
                </Container>
                <DepartmentModalCreate is_open={this.state.departmentCreate}/>
            </div>

        );
    }


    componentDidMount() {
        fetch('/api/department/all')
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
                    departmentsLoaded: true,
                    departments: data.data
                })
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }
}