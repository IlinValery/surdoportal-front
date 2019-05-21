import React from 'react';
import './style.css'
import Modal from "reactstrap/es/Modal";
import ModalHeader from "reactstrap/es/ModalHeader";
import ModalBody from "reactstrap/es/ModalBody";
import ModalFooter from "reactstrap/es/ModalFooter";
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Label from "reactstrap/es/Label";
import Input from "reactstrap/es/Input";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

export default class MediaModalEdit extends React.Component {

    constructor(props){
        super(props);

        this.state={
            isOpenedOut: false,
            isCloseHere: false,
            isOpened: false,
            youtube_id: this.props.object.youtube_id,
            type: this.props.object.type,
            allowEdit: false,
            hasChanged: false
        };
        this.types = {
            1: "sign",
            2: "articulation",
            3: "example"
        };
        this.toggleClose = this.toggleClose.bind(this);
        this.editObject = this.editObject.bind(this);
        this.changeField = this.changeField.bind(this);
    }

    toggleClose(){
        this.setState({isCloseHere: !this.state.isCloseHere})
    }
    getComponentType(type_number){

        return this.types[type_number]
    }

    isEmptyField = field => field === "" || field===undefined;

    setFieldsToState(e){
        this.setState({[e.target.name]: e.target.value});
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve(100);
            }, 100)
        });
    }
    verifyFields(){
        if (this.isEmptyField(this.state.youtube_id) || this.isEmptyField(this.state.type) || !this.state.hasChanged) {
            this.setState({
                allowEdit: false
            })
        }
        else {
            this.setState({
                allowEdit: true
            })
        }
    }
    changeField(e){
        this.setFieldsToState(e).then(()=>{
            this.verifyFields()
        })
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.is_open!==prevProps.is_open || this.state.isCloseHere!==prevState.isCloseHere)
            this.setState({
                isOpened: !!(this.state.isCloseHere^this.props.is_open)
            })
        if ((prevProps.object.youtube_id !== this.state.youtube_id || prevProps.object.type !== this.state.type ) && !this.state.hasChanged){
            this.setState({
                hasChanged: true
            })
        }

    }

    editObject(){
        fetch('/api/media/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'media_id':this.props.object.idmedia,
                'youtube_id':this.state.youtube_id,
                'type':this.state.type,
                'term':this.props.object.term

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
                    console.log(data)
                } else {
                    window.location.reload()
                }
            })
            .catch((err) => {
                console.log('Fetch Error:', err);
            });
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpened} style={{minWidth: "40%"}}>
                <ModalHeader>Изменение видеофайла</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="youtube_id">Youtube ID</Label>
                            <Input
                                type="text"
                                name="youtube_id"
                                id="youtube_id"
                                defaultValue={this.props.object.youtube_id}
                                onChange={this.changeField}
                                placeholder="Youtube ID"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="type">Тип видео</Label>
                            <Input type="select"
                                   name="type"
                                   defaultValue={this.getComponentType(this.props.object.type)}
                                   onChange={this.changeField}
                                   id="type">
                                <option value="">Не выбрано</option>
                                <option value={"sign"}>Жест</option>
                                <option value={"articulation"}>Артикуляция</option>
                                <option value={"example"}>Контекстный пример</option>
                            </Input>
                        </FormGroup>
                    </Form>
                    {this.isEmptyField(this.state.youtube_id)?(<></>):(
                        <div>
                            <h6>Предварительный просмотр видео:</h6>
                            <Row>
                                <Col md={2}/>
                                <Col>
                                    <div className="embed-responsive embed-responsive-16by9" >
                                        <iframe title={"Изменяемое видео"} className="embed-responsive-item"
                                                src={"https://www.youtube.com/embed/"+this.state.youtube_id+"?rel=0"}></iframe>
                                    </div>
                                </Col>
                                <Col md={2}/>

                            </Row>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>

                    <Button color={"primary"}
                            {...this.state.allowEdit? {}:{disabled: true}}
                            onClick={this.editObject}>
                        Изменить
                    </Button>
                    <Button {...this.state.hasChanged? {color: "danger"}:{color: "secondary"}}
                            onClick={this.toggleClose}>Закрыть окно</Button>
                </ModalFooter>
            </Modal>

        );
    }

    componentWillMount() {
        this.setState({
            youtube_id: this.props.object.youtube_id,
            type: this.getComponentType(this.props.object.type),
        })
    }


    componentDidMount() {
        this.verifyFields()
    }
}