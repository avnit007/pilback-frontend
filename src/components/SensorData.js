import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteSensorData, getSensorData, saveSensorData } from '../api/SensorDataApi';
import { useForm } from 'react-hook-form';
import Loader from './Loader';

const defaultValues = {
    sensorId: '',
    tag: '',
}

function SensorData() {
    const [sensors, setSensors] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });
    const { node } = useParams();
    const navigate = useNavigate();

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        reset(defaultValues);
    };

    useEffect(() => {
        if (!sensors.length && node) {
            handleSensorData();
        }
    }, []);

    const handleSensorData = () => {
        setIsLoader(true);
        getSensorData(node).then((res) => {
            if (res.data) {
                setIsLoader(false);
                setSensors(res.data);
            }
        });
    }

    const handleEditSensor = (sensor) => {
        handleShow();
        reset(sensor);
    }

    const handleDeleteSensor = (sensor) => {
        deleteSensorData(sensor.id).then(() => {
            handleSensorData();
        });
    }

    const onSubmitHandle = (data) => {
        setIsLoader(true);
        data.node = node;
        saveSensorData(data).then(() => {
            handleClose();
            handleSensorData();
            setIsLoader(false);
        }).catch(() => {
            console.log('Error: Something went wrong');
            setIsLoader(false);
        });
    }

    const actionTemplate = (sensor) => {
        return (
            <>
                <Link to={`/${sensor.sensorId}/payloads`} className="me-3 px-3 shadow-none btn btn-outline-success btn-sm"> View </Link>
                <Button variant="outline-warning" size="sm" onClick={() => handleEditSensor(sensor)} className='me-3 px-3 shadow-none'> Edit </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteSensor(sensor)} className='me-3 px-3 shadow-none'> Delete </Button>
            </>
        )
    }

    return (
        <div className='main-div'>
            {isLoader && <Loader />}
            <div className='header'>
                <h4>Sensors</h4>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-3 px-3 shadow-none" onClick={() => navigate(-1)}> Back </Button>
                    <Button variant="outline-primary" size="sm" className='px-3 shadow-none' onClick={handleShow}> Add Sensors </Button>
                </div>
            </div>
            <div className="card">
                <DataTable value={sensors} responsiveLayout="scroll">
                    <Column field="id" header="Id"></Column>
                    <Column field="sensorId" header="Sensor id"></Column>
                    <Column field="tag" header="tag"></Column>
                    <Column body={actionTemplate} header="Action"></Column>
                </DataTable>
            </div>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Sensor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitHandle)}>
                        <Container>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="sensorId">
                                        <Form.Label>Sensor Id</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="enter sensor id"
                                            className="shadow-none"
                                            name="sensorId"
                                            {...register("sensorId", { required: true })}
                                        />
                                        {errors.sensorId && <small className="error-msg">Sensor id is required</small>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="tag">
                                        <Form.Label>Tag</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="enter tag"
                                            className="shadow-none"
                                            name="tag"
                                            {...register("tag", { required: true })}
                                        />
                                        {errors.tag && <small className="error-msg">Tag is required</small>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col className="d-flex justify-content-end">
                                    <Button variant="secondary" size="sm" onClick={handleClose} className="me-3 px-3 shadow-none"> Close </Button>
                                    <Button type="submit" variant="primary" size="sm" className="px-3 shadow-none"> Submit </Button>
                                </Col>
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SensorData;
