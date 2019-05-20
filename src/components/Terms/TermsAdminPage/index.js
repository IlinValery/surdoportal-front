import React from 'react';
import './style.css'
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TermModalCreate from "./TermModalCreate";


export default class TermsAdminPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            disciplines: [],
            users: [],
            teachers: [],
            loadedFilter: false,
            objectCreate: false,
        };

        this.addObjectToggle = this.addObjectToggle.bind(this);

    }

    addObjectToggle() {
        console.log("here")
        this.setState({
            objectCreate: !this.state.objectCreate,
        })
    }

    render() {
        console.log(this.state.disciplines, this.state.users);
        return (
            <div>
                <h1 className={"text-center"}>Панель управления терминами</h1>
                <Row>
                    <Col md={9}>

                    </Col>
                    <Col md={3}>
                        {this.state.loadedFilter? (
                            <div className={"filter-terms"}>
                                <Form>
                                    <FormGroup>
                                        <Label check>
                                            <Input type="checkbox" /> Отображать утвержденные термины
                                        </Label>
                                    </FormGroup>
                                    {this.state.disciplines.length>0? (
                                        <FormGroup>
                                            <Label for="discipline">Дисциплина</Label>
                                            <Input type="select"
                                                   name="discipline_id"
                                                   id="discipline">
                                                <option value={0}>Не выбрано</option>
                                                {this.renderDiscipline(this.state.disciplines)}
                                            </Input>
                                        </FormGroup>
                                    ):(<></>)}
                                    <FormGroup>
                                        <Label for="user">Пользователь</Label>
                                        <Input type="select"
                                               name="user_id"
                                               id="user">
                                            <option value={0}>Не выбрано</option>
                                            {this.renderUsers(this.state.users)}
                                        </Input>
                                    </FormGroup>
                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"}>
                                        <FontAwesomeIcon icon={"search"} style={{marginRight: "8px"}}/>
                                        Показать
                                    </Button>
                                    {(this.state.disciplines.length>0 && this.state.teachers.length>0)? (<div>
                                        <Button color={"primary"}
                                                onClick={this.addObjectToggle} style={{marginTop: "16px"}}>
                                            <FontAwesomeIcon icon={"plus"} style={{marginRight: "8px"}}/>
                                            Добавить новый
                                        </Button>
                                        <TermModalCreate is_open={this.state.objectCreate}
                                                         teachers={this.state.teachers}
                                                         disciplines={this.state.disciplines}/>
                                    </div>):(<></>)}
                                </div>

                            </div>


                        ):(<></>)}
                    </Col>
                </Row>
            </div>

        );
    }


    componentDidMount() {
        this.loadFilters()
    }


    renderDiscipline(array){
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].iddiscipline} key={array[i].iddiscipline}>{array[i].name} ({array[i].department_id})</option>);
        }
        return  objectsItems;
    }

    renderUsers(array){
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].iduser} key={array[i].iduser}>{array[i].first_name} {array[i].last_name}</option>);
        }
        return  objectsItems;
    }

    loadFilters(){
        fetch('/api/term/disciplines_users')
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
                    disciplines: data.result.disciplines,
                    users: data.result.users,
                    teachers: data.result.teachers,
                    loadedFilter: true
                });

            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
    }


}