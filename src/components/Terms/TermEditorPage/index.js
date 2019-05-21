import React from 'react';
import './style.css'
import Jumbotron from "reactstrap/es/Jumbotron";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";
import Button from "reactstrap/es/Button";
import LoadingMessage from "../../Common/LoadingMessage";
import jwt_decode from "jwt-decode";
import ModalFooter from "reactstrap/es/ModalFooter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import Alert from "reactstrap/es/Alert";

export default class TermEditorPage extends React.Component {

    constructor(props){
        super(props);

        this.state={
            term_id: 0,
            term: [],
            media: [],
            contentLoaded: false,
            mediaLoaded: false,

            caption: "",
            description: "",
            discipline_id: "",
            teacher_id: "",
            lesson: "",
            image_path: "",
            is_shown: false,
            allowCreate: false,
            disciplines: [],
            teachers: [],
            cur_user: 0,
            is_superuser: 0,
            modalDeleteOpen: false,
            itemDeleteStatusBad: false,

        }
        this.changeField = this.changeField.bind(this);
        this.getDeleteDialog = this.getDeleteDialog.bind(this);

    }

    getDeleteDialog(){
        this.setState(prevState => ({
            modalDeleteOpen: !prevState.modalDeleteOpen
        }));
    }

    deleteItem(){
        console.log("delete item term:");
        fetch('/api/term/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'term_id':this.state.term_id
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
                if (data.result.code===1){
                    this.setState({
                        itemDeleteStatusBad: true
                    })
                } else {
                    window.location.href = "/terms/editor"
                }
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }
    validateItem(){
        fetch('/api/term/validate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'term_id': this.state.term_id,
                'is_show': !this.state.is_shown
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
                if (data.result.code===1){
                    this.setState({
                        itemDeleteStatusBad: true
                    })
                } else {
                    window.location.reload()
                }
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }


    componentWillMount() {
        let term_id = parseInt(this.props.match.params.number, 10);
        this.setState({
            term_id: term_id,
        })
        const token = localStorage.getItem('usertoken');
        if (token){
            const decoded = jwt_decode(token);
            this.setState({
                cur_user: decoded.identity.id,
                is_superuser: decoded.identity.is_superuser
            })
        }
    }
    isEmptyField = field => field === "";

    setFieldsToState(e){
        this.setState({[e.target.name]: e.target.value});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }

    verifyFields(){
        if (this.isEmptyField(this.state.caption) || this.isEmptyField(this.state.description)
            || this.isEmptyField(this.state.discipline_id) || this.isEmptyField(this.state.teacher_id)
            || this.isEmptyField(this.state.lesson) || this.isEmptyField(this.state.image_path)) {
            this.setState({
                allowCreate: false
            })
        }
        else {
            this.setState({
                allowCreate: true
            })
        }
    }
    changeField(e){
        this.setFieldsToState(e).then(()=>{this.verifyFields()})
    }


    renderDisciplines(array) {
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].iddiscipline} key={array[i].iddiscipline}>{array[i].name} ({array[i].department_id})</option>);
        }
        return  objectsItems;
    }
    renderTeachers(array) {
        const objectsItems = [];
        for (let i=0; i < array.length; i++) {
            objectsItems.push(<option value={array[i].idteacher} key={array[i].idteacher}>{array[i].name}</option>);
        }
        return  objectsItems;
    }
    editObject(){
        fetch('/api/term/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'term_id':this.state.term_id,
                'caption':this.state.caption,
                'description':this.state.description,
                'discipline_id':this.state.discipline_id,
                'teacher_id':this.state.teacher_id,
                'lesson':this.state.lesson,
                'image_path':this.state.image_path,
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
                if (data.result.code===1){
                } else {
                    window.location.reload()
                }
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
    }
    renderMedia
    render() {
        //console.log(this.state)
        return (
            <div>
                <h1 className={"text-center"}>Редактирование термина</h1>
                {this.state.contentLoaded? (
                    <Jumbotron style={{paddingTop: "16px", paddingBottom: "16px"}}>
                        <h2 className={"text-center"}>Общие сведения</h2>
                        <Row form>
                            <Col md={8}>
                                <Form>
                                    <FormGroup>
                                        <Label for="caption">Название термина</Label>
                                        <Input
                                            type="text"
                                            name="caption"
                                            id="caption"
                                            defaultValue={this.state.term.caption}
                                            onChange={this.changeField}
                                            placeholder="Название термина"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="image_path">Ссылка на изображение</Label>
                                        <Input
                                            type="text"
                                            name="image_path"
                                            id="image_path"
                                            defaultValue={this.state.term.image_path}
                                            onChange={this.changeField}
                                            placeholder="Ссылка на изображение"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="description">Описание термина</Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            defaultValue={this.state.term.description}
                                            onChange={this.changeField}
                                            placeholder="Описание термина"
                                        />
                                    </FormGroup>
                                    <Row form>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label for="discipline">Дисциплина</Label>
                                                <Input type="select"
                                                       name="discipline_id"
                                                       onChange={this.changeField}
                                                       defaultValue={this.state.term.discipline}
                                                       id="discipline">
                                                    <option value="">Не выбрано</option>
                                                    {this.renderDisciplines(this.state.disciplines)}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="teacher">Преподаватель</Label>
                                                <Input type="select"
                                                       name="teacher_id"
                                                       onChange={this.changeField}
                                                       defaultValue={this.state.term.teacher}
                                                       id="teacher">
                                                    <option value="">Не выбрано</option>
                                                    {this.renderTeachers(this.state.teachers)}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="lesson">Номер лекции</Label>
                                                <Input type="select"
                                                       name="lesson"
                                                       defaultValue={this.state.term.lesson}
                                                       onChange={this.changeField}
                                                       id="lesson">
                                                    <option value="">Не выбрано</option>
                                                    <option value={1}>1</option>
                                                    <option value={2}>2</option>
                                                    <option value={3}>3</option>
                                                    <option value={4}>4</option>
                                                    <option value={5}>5</option>
                                                    <option value={6}>6</option>
                                                    <option value={7}>7</option>
                                                    <option value={8}>8</option>
                                                    <option value={9}>9</option>
                                                    <option value={10}>10</option>
                                                    <option value={11}>11</option>
                                                    <option value={12}>12</option>
                                                    <option value={13}>13</option>
                                                    <option value={14}>14</option>
                                                    <option value={15}>15</option>
                                                    <option value={16}>16</option>
                                                    <option value={17}>17</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                    </Row>

                                </Form>
                            </Col>
                            <Col>
                                <p className={"text-center"}>Предпросмотр изображения</p>
                                <img className={"rounded mx-auto d-block img-fluid img-thumbnail"} style={{maxHeight: "250px"}} src={this.state.image_path} alt={""}/>
                                <p className={"text-center"}><b>Термин {this.state.is_shown?(""):("не ")}утвержден</b></p>
                                <Row style={{margin: "16px"}}>
                                    <Col md={2}/>
                                    <Col className={"text-center"}>
                                        <Button color={"primary"} block
                                                {...this.state.allowCreate? {}:{disabled: true}}
                                                onClick={()=>this.editObject('term')}>
                                            Изменить
                                        </Button>
                                    </Col>
                                    <Col md={2}/>
                                </Row>
                                {this.state.is_superuser? (<div>
                                    <Row style={{margin: "16px"}}>
                                        <Col md={2}/>
                                        <Col className={"text-center"}>
                                            <Button color="danger" outline block
                                                    onClick={this.getDeleteDialog}
                                                    title={"Удалить термин "+this.state.term.caption}>
                                                <FontAwesomeIcon icon="trash" style={{marginRight: "16px"}}/> Удалить термин
                                            </Button>
                                        </Col>
                                        <Col md={2}/>
                                    </Row>
                                    <Modal isOpen={this.state.modalDeleteOpen} toggle={this.getDeleteDialog} style={{minWidth: "40%"}}>
                                        <ModalHeader toggle={this.toggle}>Подтвердите действие</ModalHeader>
                                        <ModalBody>
                                            Вы действительно хотите удалить термин {this.state.term.caption}?
                                        </ModalBody>
                                        <ModalFooter>
                                            {this.state.itemDeleteStatusBad? (<Alert color={"danger"}>Удаление не удалось, что-то пошло не так, обновите страницу</Alert>):(<></>)}
                                            <Button color="danger" onClick={()=>{this.deleteItem()}}>Удалить</Button>
                                            <Button color="primary" onClick={this.getDeleteDialog}>Отмена</Button>
                                        </ModalFooter>
                                    </Modal>


                                    <Row style={{margin: "16px"}}>
                                        <Col md={2}/>
                                        <Col className={"text-center"}>
                                            <Button {...this.state.is_shown? {color: "secondary"}:{color: "danger"}}
                                                    onClick={()=>this.validateItem()} block>{this.state.is_shown?("Снять с утверждения"):("Утвердить термин")}</Button>
                                        </Col>
                                        <Col md={2}/>
                                    </Row>
                                </div>):(<></>)}

                            </Col>
                        </Row>
                        <h2 className={"text-center"}>Видеоконтент ({this.state.media.length}/3) <Button>Добавить видео</Button></h2>
                        {this.state.mediaLoaded? (
                            <Row>
                                здесь кнопки на контенты (это еще сделать бы)
                            </Row>
                        ):(<></>)}

                    </Jumbotron>
                ):(<LoadingMessage message={"Информация о термине загружается"}/>)}
            </div>

        );
    }

    componentDidMount() {
        fetch('/api/term/' + this.state.term_id)
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
                    disciplines: data.data.disciplines,
                    teachers: data.data.teachers,
                })
            }).then(()=>{
                if (Object.keys(this.state.term).length>0){
                    this.setState({
                        caption: this.state.term.caption,
                        description: this.state.term.description,
                        discipline_id: this.state.term.discipline,
                        teacher_id: this.state.term.teacher,
                        lesson: this.state.term.lesson,
                        image_path: this.state.term.image_path,
                        is_shown: this.state.term.is_shown,
                        allowCreate: false

                    });
                    if ((+this.state.cur_user === this.state.term.creator) || this.state.is_superuser){
                        this.setState({
                            contentLoaded: true,
                        })
                    }
                    if (Object.keys(this.state.media).length>0){
                        this.setState({mediaLoaded: true});
                    } else {this.setState({media: [],mediaLoaded: false});}
                } else { this.setState({contentLoaded: false});}
        })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });

    }


}