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
import TermInTable from "./TermInTable";
import jwt_decode from "jwt-decode";


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
            only_invalided_cur: 1,
            filtersApplied: true,
            page:1,
            cur_user: 0,
            is_superuser: 0

        };

        this.changeField = this.changeField.bind(this);
        this.changeOnlyValided = this.changeOnlyValided.bind(this);
        this.addObjectToggle = this.addObjectToggle.bind(this);

    }

    addObjectToggle() {
        this.setState({
            objectCreate: !this.state.objectCreate,
        })
    }

    renderObjects(array) {
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<TermInTable key={array[i].idterm} elem_number={"user"+i} object={array[i]} only_invalided={this.state.only_invalided} is_superuser={this.state.is_superuser}/>);
        }
        return  objectsItems;
    }

    changeField(e){
        this.setState({[e.target.name]: e.target.value, filtersApplied: false});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }
    changeOnlyValided(){
        this.setState({
            only_invalided_cur: !this.state.only_invalided_cur,
            filtersApplied: false
        });
    }
    applyFilter(){
        this.setState({
            loadedTerms: false,
        });
        this.loadTerms();
    }
    render() {
        return (
            <div>
                <h1 className={"text-center"}>Панель управления терминами {this.state.is_superuser?("(администратор)"):("")}</h1>
                <Row>
                    <Col sm={12} md={9}>
                        {this.state.loadedTerms? (<div>
                            {this.state.terms.length>0?(<div>
                                <Table hover borderless className={"text-center"}>
                                    <thead>
                                    <tr>
                                        <th>Название термина</th>
                                        <th>Дисциплина</th>
                                        {this.state.only_invalided? (<></>):(<th>Одобрено</th>)}
                                        {this.state.is_superuser? (<th>Создатель</th>):(<></>)}
                                        <th>Дата изменения</th>
                                        <th>Действие</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {this.renderObjects(this.state.terms)}
                                    </tbody>
                                </Table>
                            </div>):(<h2 className={"text-center"} style={{marginTop: "20vh"}}>Не удалось найти термины по запросу :(</h2>)}

                        </div>):(<LoadingMessage message={"Спокуха, мы загружаем для вас термины"}/>)}

                    </Col>
                    <Col>
                        {this.state.loadedFilter? (
                            <div className={"filter-terms"}>
                                <Form>
                                    {this.state.disciplines.length>0? (
                                        <FormGroup>
                                            <Label for="discipline">Дисциплина</Label>
                                            <Input type="select"
                                                   name="discipline_id"
                                                   onChange={this.changeField}
                                                   id="discipline">
                                                <option value={0}>Все</option>
                                                {this.renderDiscipline(this.state.disciplines)}
                                            </Input>
                                        </FormGroup>
                                    ):(<></>)}
                                    {this.state.is_superuser? (
                                        <FormGroup>
                                            <Label for="user">Пользователь</Label>
                                            <Input type="select"
                                                   name="creator_id"
                                                   onChange={this.changeField}
                                                   id="user">
                                                <option value={0}>Все</option>
                                                {this.renderUsers(this.state.users)}
                                            </Input>
                                        </FormGroup>
                                    ): (<></>)}


                                    <FormGroup check style={{paddingLeft:0}}>
                                        <Label check>
                                            <CustomInput type="switch" id="CustomSwitch"
                                                         onClick={this.changeOnlyValided}
                                                         name="customSwitch"
                                                         label="Отображать утвержденные" />
                                        </Label>
                                    </FormGroup>

                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"} block
                                            onClick={()=>this.applyFilter()}
                                            {...this.state.filtersApplied? {disabled: true, outline: true}:{}} style={{marginTop: "32px"}}>
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

    componentWillMount() {
        const token = localStorage.getItem('usertoken');
        if (token){
            const decoded = jwt_decode(token)
            this.setState({
                cur_user: decoded.identity.id,
                is_superuser: decoded.identity.is_superuser
            })
            if (!decoded.identity.is_superuser) {
                this.setState({
                    creator_id: decoded.identity.id
                })
            }
        }

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
                'only_invalided':this.state.only_invalided_cur,
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
                console.log(data)
                this.setState(  {
                    loadedTerms: true,
                    filtersApplied: true,
                    only_invalided: this.state.only_invalided_cur,
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