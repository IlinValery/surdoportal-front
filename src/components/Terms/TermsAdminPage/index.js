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
import CustomInput from "reactstrap/es/CustomInput";
import LoadingMessage from "../../Common/LoadingMessage";
import Table from "reactstrap/es/Table";


export default class TermsAdminPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            disciplines: [],
            users: [],
            teachers: [],
            terms: [],
            loadedFilter: false,
            loadedTerms: false,
            objectCreate: false,
            discipline_id: 0,
            creator_id: 0,
            only_invalided: 1,
            page:1

        };


        this.addObjectToggle = this.addObjectToggle.bind(this);

    }

    addObjectToggle() {
        console.log("here")
        this.setState({
            objectCreate: !this.state.objectCreate,
        })
    }
    renderObjects(array){
        console.log(array)
    }
    render() {
        return (
            <div>
                <h1 className={"text-center"}>Панель управления терминами</h1>
                <Row>
                    <Col md={9}>
                        {this.state.loadedTerms? (<div>
                            {this.state.terms.length>0?(<div>
                                <Table hover borderless className={"text-center"}>
                                    <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Дисциплина</th>
                                        <th>Преподаватель</th>
                                        <th>Одобрено</th>
                                        <th>Создатель</th>
                                        <th>Дата создания</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {this.renderObjects(this.state.terms)}
                                    </tbody>
                                </Table>
                            </div>):(<h2 className={"text-center"}>Не удалось найти термины по запросу</h2>)}

                        </div>):(<LoadingMessage message={"Спокуха, мы загружаем для вас термины"}/>)}

                    </Col>
                    <Col md={3}>
                        {this.state.loadedFilter? (
                            <div className={"filter-terms"}>
                                <Form>
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
                                    <FormGroup check style={{paddingLeft:0}}>
                                        <Label check>
                                            <CustomInput type="switch" id="CustomSwitch" name="customSwitch"
                                                         label="Отображать утвержденные" />
                                        </Label>
                                    </FormGroup>

                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"} block outline style={{marginTop: "32px"}}>
                                        <FontAwesomeIcon icon={"search"} style={{marginRight: "8px"}}/>
                                        Показать
                                    </Button>
                                    {(this.state.disciplines.length>0 && this.state.teachers.length>0)? (<div>
                                        <Button color={"primary"} block outline
                                                onClick={this.addObjectToggle} style={{marginTop: "32px"}}>
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
        this.loadFilters().then(()=>this.loadTerms());
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
    loadTerms(){
        fetch('/api/term/view_edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'discipline_id':this.state.discipline_id,
                'creator_id':this.state.creator_id,
                'only_invalided':this.state.only_invalided,
                'page': this.state.page
            })
        })
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
                    loadedTerms: true,
                    terms: data.result
                })

            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

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
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 200)
        });
    }


}