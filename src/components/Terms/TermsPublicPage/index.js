import React from 'react';
import './style.css'
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListGroup from "reactstrap/es/ListGroup";
import ListGroupItem from "reactstrap/es/ListGroupItem";
import LoadingMessage from "../../Common/LoadingMessage";
import Jumbotron from "reactstrap/es/Jumbotron";
import MediaOnPage from "../../Media/MediaOnPage";

export default class TermsPublicPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            loadedFilter: false,
            loadedTerms: false,
            filtersApplied: true,
            terms: [],
            disciplines: [],
            departments: [],
            department_id:0,
            discipline_id:0,
            phrase: "",
            chosen_term: 0,
            term: {},
            media: [],
            contentLoaded: false,
            mediaLoaded: false


        }
        this.changeField = this.changeField.bind(this);

    }
    changeField(e){
        this.setState({[e.target.name]: e.target.value, filtersApplied: false});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }
    applyFilter(){
        this.setState({
            loadedTerms: false,
        });
        this.loadTerms();
    }

    renderDiscipline(array, department){
        let objectsItems = [];
        for (let i=0; i < array.length; i++) {
            if (department>0){
                if (array[i].department_id.iddepartment===+department){
                    objectsItems.push(<option value={array[i].iddiscipline} key={array[i].iddiscipline}>{array[i].name} ({array[i].department_id.initials})</option>);
                } else {}
            } else {

                objectsItems.push(<option value={array[i].iddiscipline} key={array[i].iddiscipline}>{array[i].name} ({array[i].department_id.initials})</option>);
            }
        }
        return  objectsItems;
    }

    renderDepartments(array){
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].iddepartment} key={array[i].iddepartment}>{array[i].initials} ({array[i].caption})</option>);
        }
        return  objectsItems;
    }
    renderTerms(array){
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(
                <ListGroupItem key={array[i].idterm} className={" overflow-hidden term-in-filter"}
                               tag="button" title={array[i].caption}
                               onClick={()=>{this.renderChosenTerm(array[i].idterm)}}>
                    {array[i].caption}
                </ListGroupItem>
            );
        }
        return  objectsItems;
    }

    loadFilters(){
        fetch('/api/term/filters')
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
                    disciplines: data.data.disciplines,
                    departments: data.data.departments,
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
    loadTerms(){
        fetch('/api/term/view', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'discipline_id':this.state.discipline_id,
                'phrase':this.state.phrase,
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
                this.setState(  {
                    loadedTerms: true,
                    filtersApplied: true,
                    terms: data.data
                })

            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }

    render() {
        return (
            <div>
                <Row>
                    <Col lg={3} className={"filter-menu"}>
                        {this.state.loadedFilter? (
                            <div className={"filter-terms-view"}>
                                {this.state.disciplines.length>0? (
                                    <div>
                                <Form>
                                            <FormGroup>
                                                <Label for="department" title={"Помогает выбрать дисциплины"}>Кафедра *</Label>
                                                <Input type="select"
                                                       name="department_id"
                                                       onChange={this.changeField}
                                                       id="department">
                                                    <option value={0}>Все</option>
                                                    {this.renderDepartments(this.state.departments)}
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="discipline">Дисциплина</Label>
                                                <Input type="select"
                                                       name="discipline_id"
                                                       onChange={this.changeField}
                                                       id="discipline">
                                                    <option value={0}>Все</option>
                                                    {this.renderDiscipline(this.state.disciplines, this.state.department_id)}
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="phrase">Фраза для поиска</Label>
                                                <Input
                                                    type="text"
                                                    name="phrase"
                                                    id="phrase"
                                                    onChange={this.changeField}
                                                    placeholder="Фраза для поиска"
                                                />
                                            </FormGroup>


                                </Form>
                                <div className={"text-center"}>
                                    <Button color={"primary"} block
                                            onClick={()=>this.applyFilter()}
                                            {...this.state.filtersApplied? {disabled: true, outline: true}:{}} style={{marginTop: "32px"}}>
                                        <FontAwesomeIcon icon={"search"} style={{marginRight: "8px"}}/>
                                        Показать
                                    </Button>
                                </div>
                                </div>):(<></>)}

                            </div>


                        ):(<></>)}
                        <div className={"filter-divider"}/>
                        {this.state.loadedTerms?(
                            <ListGroup>
                                {this.renderTerms(this.state.terms)}
                            </ListGroup>
                        ):(<LoadingMessage message={"Загрузка списка терминов"}/>)}
                    </Col>
                    <Col>
                        {this.state.contentLoaded? (<div>
                            <Row>
                                <Col>
                                    <h3>{this.state.term.caption}</h3>
                                    <img className={"rounded d-block img-fluid img-thumbnail"} style={{maxHeight: "250px"}} src={this.state.term.image_path} alt={""}/>
                                    <Jumbotron color={"black"} style={{padding: "8px", marginTop: "32px"}}>
                                        <p>{this.state.term.description}</p>
                                        <p>Дисциплина: {this.renderDisciplineTerm(this.state.term.discipline)}</p>
                                        <p>Номер лекции: {this.state.term.lesson}</p>
                                        <p style={{margin: 0}}>Преподаватель: {this.renderTeacherTerm(this.state.term.teacher)}</p>
                                    </Jumbotron>
                                </Col>
                                <Col>
                                    {this.state.mediaLoaded? (
                                        <div>
                                            <h5 className={"text-center"}>Материал по теме</h5>
                                            {this.renderMedia(this.state.media)}
                                        </div>
                                    ):(<></>)}

                                </Col>
                            </Row>

                        </div>):(<h3>Выберите термин</h3>)}
                    </Col>
                </Row>
            </div>

        );
    }
    componentDidMount() {
        this.loadFilters().then(()=>this.loadTerms())
    }

    renderMedia(array){
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<MediaOnPage key={array[i].idmedia} media={array[i]}/>);
        }
        return  objectsItems;
    }
    renderTeacherTerm(teacher){
        let str = "";
        let array = this.state.teachers
        let array_dep = this.state.departments;
        let cur_department = {}
        for (let i=0; i < array.length; i++) {
            for (let j=0; j<array_dep.length;j++){
                if (array_dep[j].iddepartment===array[i].department_id){
                    cur_department = array_dep[j];
                }

            }
            if (array[i].idteacher===teacher){
                str = array[i].name + " ("+cur_department.initials+")"

            }
        }
        return  str;
    }
    renderDisciplineTerm(discipline){
        let str = "";
        let array = this.state.disciplines;
        for (let i=0; i < array.length; i++) {
            if (array[i].iddiscipline===+discipline){
                str = array[i].name + " ("+array[i].department_id.initials+")"
            }
        }
        return  str;
    }

    renderChosenTerm(term){
        this.updateCurTerm(term).then(()=>this.loadTermInfo())
    }

    updateCurTerm(term){
        this.setState({
            chosen_term:term
        })
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }

    loadTermInfo(){
        fetch('/api/term/' + this.state.chosen_term)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    term: data.data.term,
                    media: data.data.media,
                    teachers: data.data.teachers,
                })
            }).then(()=>{
            if (Object.keys(this.state.term).length>0){
                this.setState({
                    contentLoaded: true
                });
                if (Object.keys(this.state.media).length>0){
                    this.setState({mediaLoaded: true});
                } else {this.setState({mediaLoaded: false});}
            } else { this.setState({contentLoaded: false});}
        })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }
}