import React from 'react';
import './style.css'
import Container from "reactstrap/es/Container";
import Table from "reactstrap/es/Table";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Button from "reactstrap/es/Button";
import LoadingMessage from "../../Common/LoadingMessage";
import TeacherInTable from "../TeacherInTable";
import TeacherModalCreate from "../TeacherModalCreate";

export default class TeacherPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            objectsLoaded: false,
            objects: [],
            objectCreate: false,

            departmentsLoaded: false,
            departments: []
        };
        this.addObjectToggle = this.addObjectToggle.bind(this);
    }

    renderObjects(array) {
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<TeacherInTable key={array[i].idteacher} object={array[i]} departments={this.state.departments}/>);
        }
        return  objectsItems;
    }

    addObjectToggle() {
        this.setState({
            objectCreate: !this.state.objectCreate,
        })
    }


    render() {
        return (
            <div>
                <Container>
                    <h1 className={"text-center"}>Преподаватели в системе</h1>
                    {(this.state.objectsLoaded && this.state.departmentsLoaded)? (<div>
                        <Table hover borderless className={"text-center"}>
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Кафедра</th>
                                <th>Действие</th>
                            </tr>
                            </thead>

                            <tbody>
                            {this.renderObjects(this.state.objects)}
                            </tbody>
                        </Table>
                        <Row>
                            <Col/>
                            <Col className={"text-center"}>
                                <Button color={"primary"} onClick={this.addObjectToggle}>
                                    Добавить преподавателя
                                </Button>
                            </Col>
                            <Col/>
                        </Row>
                    </div>) : (<LoadingMessage message={"Загрузка списка преподавателей"}/>)}
                </Container>
                <TeacherModalCreate is_open={this.state.objectCreate} departments={this.state.departments}/>
            </div>

        );
    }

    loadDepartments(){
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
                    });
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
    }
    loadObects(table){
        fetch('/api/'+table+'/all')
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
                        objectsLoaded: true,
                        objects: data.data
                    })
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 500)
        });
    }
    componentDidMount() {
        this.loadObects('teacher').then(()=>{this.loadDepartments()})
    }
}