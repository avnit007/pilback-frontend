import React, { useEffect, useState } from "react"
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deletePayloadData, getPayloadData, savePayloadData } from "../api/PayloadDataApi";
import { useFieldArray, useForm } from "react-hook-form";
import Loader from "./Loader";

const defaultValues = {
    type: "",
    sequenceNumber: "",
    numHops: "",
    maxHops: "",
    payloadObj: [{ key: "", value: "" }],
}

function PayloadData() {
    const [payloads, setPayloads] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({ defaultValues });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "payloadObj",
    });

    const { sensor } = useParams();
    const navigate = useNavigate();

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        reset(defaultValues);
    };

    useEffect(() => {
        if (!payloads.length && sensor) {
            handlePayloadData();
        }
    }, []);

    const handlePayloadData = () => {
        setIsLoader(true);
        getPayloadData(sensor).then((res) => {
            if (res.data) {
                setIsLoader(false);
                setPayloads(res.data);
            }
        });
    }

    const handleEditPayload = (data) => {
        handleShow();
        const payloadObj = [];
        for (const key in data.payload) {
            payloadObj.push({ key: key, value: data.payload[key] });
        }
        data.payloadObj = payloadObj;
        reset(data);
    }

    const handleDeletePayload = (payload) => {
        deletePayloadData(payload.id).then(() => {
            handlePayloadData();
        });
    }

    const onSubmitHandle = (data) => {
        setIsLoader(true);
        data.sensorId = sensor;
        data.timestamp = Date.now();
        const payloadObj = {};
        data.payloadObj && data.payloadObj.length && data.payloadObj.map((payload) => {
            payloadObj[payload.key] = payload.value;
            return payload;
        });
        data.payload = JSON.stringify(payloadObj);
        delete data.payloadObj;

        savePayloadData(data).then(() => {
            handleClose();
            handlePayloadData();
            setIsLoader(false);
        }).catch(() => {
            console.log("Error: Something went wrong");
            setIsLoader(false);
        });
    }

    const actionTemplate = (payload) => {
        return (
            <>
                <Button variant="outline-warning" size="sm" onClick={() => handleEditPayload(payload)} className="me-3 px-3 shadow-none"> Edit </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeletePayload(payload)} className="me-3 px-3 shadow-none"> Delete </Button>
            </>
        )
    }

    const payloadTemplate = (data) => {
        let str = '';
        for (const key in data.payload) {
            str += `${key}: ${data.payload[key]}, `
        }
        return str;
    }

    return (
        <div className="main-div">
            {isLoader && <Loader />}
            <div className="header">
                <h4>Payloads</h4>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-3 px-3 shadow-none" onClick={() => navigate(-1)}> Back </Button>
                    <Button variant="outline-primary" size="sm" className="px-3 shadow-none" onClick={handleShow}> Add Payload </Button>
                </div>
            </div>
            <div className="card">
                <DataTable value={payloads} responsiveLayout="scroll">
                    <Column field="type" header="Type"></Column>
                    <Column field="sensorId" header="Sensor id"></Column>
                    <Column body={payloadTemplate} header="Payload"></Column>
                    <Column field="sequenceNumber" header="Sequence Number"></Column>
                    <Column field="numHops" header="Num Hops"></Column>
                    <Column field="maxHops" header="Max Hops"></Column>
                    <Column body={actionTemplate} header="Action"></Column>
                </DataTable>
            </div>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Payload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitHandle)}>
                        <Container>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="type">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="enter payload type"
                                            className="shadow-none"
                                            name="type"
                                            {...register("type", { required: true })}
                                        />
                                        {errors.type && <small className="error-msg">Type is required</small>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="sequenceNumber">
                                        <Form.Label>Sequence Number</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="enter sequence number"
                                            className="shadow-none"
                                            name="sequenceNumber"
                                            {...register("sequenceNumber", { required: true })}
                                        />
                                        {errors.sequenceNumber && <small className="error-msg">Sequence number is required</small>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="numHops">
                                        <Form.Label>NumHops</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="enter numHops"
                                            className="shadow-none"
                                            name="numHops"
                                            {...register("numHops", { required: true })}
                                        />
                                        {errors.numHops && <small className="error-msg">NumHops is required</small>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="maxHops">
                                        <Form.Label>MaxHops</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="enter maxHops"
                                            className="shadow-none"
                                            name="maxHops"
                                            {...register("maxHops", { required: true })}
                                        />
                                        {errors.maxHops && <small className="error-msg">MaxHops is required</small>}
                                    </Form.Group>
                                </Col>
                                <div className="my-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5>Payload Details</h5>
                                        <Button variant="primary" size="sm" className="shadow-none"
                                            onClick={() => { append({ key: "", value: "" }) }}
                                        > Add </Button>
                                    </div>
                                    {fields.map((item, index) => {
                                        return (
                                            <div className="d-flex justify-content-center align-items-start" key={index}>
                                                <Form.Group className="mb-3 pe-3 w-100" controlId={`payloadObj[${index}].key`}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="enter key"
                                                        className="shadow-none"
                                                        name={`payloadObj[${index}].key`}
                                                        {...register(`payloadObj[${index}].key`, { required: true })}
                                                    />
                                                    {errors.payloadObj?.[index]?.key && <small className="error-msg">Key is required</small>}
                                                </Form.Group>
                                                <Form.Group className="mb-3 pe-3 w-100" controlId={`payloadObj[${index}].value`}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="enter value"
                                                        className="shadow-none"
                                                        name={`payloadObj[${index}].value`}
                                                        {...register(`payloadObj[${index}].value`, { required: true })}
                                                    />
                                                    {errors.payloadObj?.[index]?.value && <small className="error-msg">Value is required</small>}
                                                </Form.Group>
                                                <Button variant="danger" size="sm" onClick={() => remove(index)} className="px-3 shadow-none"> Delete </Button>
                                            </div>
                                        );
                                    })}
                                </div>
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

export default PayloadData;
