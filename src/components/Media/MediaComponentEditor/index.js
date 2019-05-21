import React from 'react';
import './style.css'
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import Button from "reactstrap/es/Button";
import ButtonGroup from "reactstrap/es/ButtonGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Popover from "reactstrap/es/Popover";
import PopoverHeader from "reactstrap/es/PopoverHeader";
import PopoverBody from "reactstrap/es/PopoverBody";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Alert from "reactstrap/es/Alert";
import MediaModalEdit from "../MediaModalEdit";

export default class MediaComponentEditor extends React.Component {

    constructor(props){
        super(props);

        this.state={
            popoverVideoOpen: false,
            modalDeleteOpen: false,
            modalEditOpen: false,
            itemDeleteStatusBad: false,
        };
        this.toggleVideo = this.toggleVideo.bind(this);
        this.types = {
            1: "Жест",
            2: "Артикуляция",
            3: "Пример"
        }
        this.getDeleteDialog = this.getDeleteDialog.bind(this);
        this.getEditDialog = this.getEditDialog.bind(this);

    }

    toggleVideo() {
        this.setState({
            popoverVideoOpen: !this.state.popoverVideoOpen
        });
    }
    componentWillMount() {

    }
    getEditDialog(){
        this.setState(prevState => ({
            modalEditOpen: !prevState.modalEditOpen
        }));
    }
    getDeleteDialog(){
        this.setState(prevState => ({
            modalDeleteOpen: !prevState.modalDeleteOpen
        }));
    }

    deleteItem(){
        fetch('/api/media/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usertoken':localStorage.getItem('usertoken'),
                'media_id':this.props.media.idmedia,
                'term':this.props.media.term
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

    getComponentName(type_number){

        return this.types[type_number]
    }
    render() {
        console.log(this.props.media)
        return (
            <Col className={"text-center"}>
                <Row>
                    <Col md={2}/>
                    <Col>
                        <ButtonGroup>
                            <Button color={"primary"} id={'Popover-' + this.props.media.idmedia}>{this.getComponentName(this.props.media.type)}</Button>
                            <Button onClick={this.getEditDialog} color={"warning"}><FontAwesomeIcon icon="pen"/></Button>
                            {this.props.is_superuser? (
                                <Button onClick={this.getDeleteDialog}
                                        title={"Удалить термин "+this.getComponentName(this.props.media.type)}
                                    color={"danger"}><FontAwesomeIcon icon="trash"/></Button>
                            ):(<></>)}
                        </ButtonGroup>
                    </Col>
                    <Col md={2}/>
                </Row>
                <Popover placement={"top"} isOpen={this.state.popoverVideoOpen} target={'Popover-' + this.props.media.idmedia} toggle={this.toggleVideo} >
                    <PopoverHeader><FontAwesomeIcon icon="video" color={"red"} style={{marginRight: "16px"}}/>Видео {this.getComponentName(this.props.media.type).toLowerCase()}</PopoverHeader>
                    <PopoverBody style={{minWidth: "280px"}} >
                        <div className="embed-responsive embed-responsive-16by9" >
                            <iframe title={this.getComponentName(this.props.media.type).toLowerCase()} className="embed-responsive-item"
                                    src={"https://www.youtube.com/embed/"+this.props.media.youtube_id+"?rel=0"}></iframe>
                        </div>
                    </PopoverBody>
                </Popover>
                <Modal isOpen={this.state.modalDeleteOpen} toggle={this.getDeleteDialog} style={{minWidth: "40%"}}>
                    <ModalHeader toggle={this.toggle}>Подтвердите действие</ModalHeader>
                    <ModalBody>
                        Вы действительно хотите удалить видео {this.getComponentName(this.props.media.type)}?
                    </ModalBody>
                    <ModalFooter>
                        {this.state.itemDeleteStatusBad? (<Alert color={"danger"}>Удаление не удалось, что-то пошло не так, обновите страницу</Alert>):(<></>)}
                        <Button color="danger" onClick={()=>{this.deleteItem()}}>Удалить</Button>
                        <Button color="primary" onClick={this.getDeleteDialog}>Отмена</Button>
                    </ModalFooter>
                </Modal>
                <MediaModalEdit is_open={this.state.modalEditOpen} object={this.props.media}/>

            </Col>

        );
    }
    componentDidMount() {

    }

}