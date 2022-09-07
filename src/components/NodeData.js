import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { getNodeData, deleteNodeData, saveNodeData } from '../api/NodeDataApi';
import Loader from './Loader';

const defaultValues = {
    tag: '',
    description: '',
}

function NodeData() {
    const [nodes, setNodes] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });
    const { site } = useParams();
    const navigate = useNavigate();

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        reset(defaultValues);
    };

    useEffect(() => {
        if (!nodes.length && site) {
            handleNodeData();
        }
    }, []);

    const handleNodeData = () => {
        setIsLoader(true);
        getNodeData(site).then((res) => {
            if (res.data) {
                setIsLoader(false);
                setNodes(res.data);
            }
        });
    }

    const handleEditNode = (node) => {
        handleShow();
        reset(node);
    }

    const handleDeleteNode = (node) => {
        deleteNodeData(node.node).then(() => {
            handleNodeData();
        })
    }

    const onSubmitHandle = (data) => {
        setIsLoader(true);
        data.site = site;
        saveNodeData(data).then(() => {
            handleClose();
            handleNodeData();
            setIsLoader(false);
        }).catch(() => {
            console.log('Error: Something went wrong');
            setIsLoader(false);
        });
    }

    const actionTemplate = (node) => {
        return (
            <>
                <Link to={`/${node.node}/sensors`} className="me-3 px-3 shadow-none btn btn-outline-success btn-sm"> View </Link>
                <Button variant="outline-warning" size="sm" onClick={() => handleEditNode(node)} className='me-3 px-3 shadow-none'> Edit </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteNode(node)} className='me-3 px-3 shadow-none'> Delete </Button>
            </>
        )
    }

    return (
        <div className='main-div'>
            {isLoader && <Loader />}
            <div className='header'>
                <h4>Nodes</h4>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-3 px-3 shadow-none" onClick={() => navigate(-1)}> Back </Button>
                    <Button variant="outline-primary" size="sm" className='px-3 shadow-none' onClick={handleShow}> Add Node </Button>
                </div>
            </div>
            <div className="card">
                <DataTable value={nodes} responsiveLayout="scroll">
                    <Column field="node" header="Node Id"></Column>
                    <Column field="tag" header="Tag"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column body={actionTemplate} header="Action"></Column>
                </DataTable>
            </div>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Node</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitHandle)}>
                        <Container>
                            <Row>
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
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="description">
                                        <Form.Label>Node description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="enter node description"
                                            className="shadow-none"
                                            name="description"
                                            {...register("description", { required: true })}
                                        />
                                        {errors.description && <small className="error-msg">Node description is required</small>}
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

export default NodeData;
