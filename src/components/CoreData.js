import React, { useEffect, useState } from "react"
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { deleteCoreData, getCoreData, saveCoreData } from "../api/CoreDataApi";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const defaultValues = {
    site: '',
    version: '',
}

function CoreData() {
    const [sites, setSites] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (!sites.length) {
            handleCoreData();
        }
    }, []);

    const handleCoreData = () => {
        setIsLoader(true);
        getCoreData().then((res) => {
            if (res.data) {
                setIsLoader(false);
                setSites(res.data);
            }
        });
    }

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        reset(defaultValues);
    };

    const handleEditSite = (site) => {
        handleShow();
        reset(site);
    }

    const handleDeleteSite = (site) => {
        deleteCoreData(site.uuid).then(() => {
            handleCoreData();
        });
    }

    const onSubmitHandle = (data) => {
        setIsLoader(true);
        saveCoreData(data).then(() => {
            handleClose();
            handleCoreData();
            setIsLoader(false);
        }).catch(() => {
            console.log('Error: Something went wrong');
            setIsLoader(false);
        });
    }

    const actionTemplate = (site) => {
        return (
            <>
                <Link to={`/${site.uuid}/nodes`} className="me-3 px-3 shadow-none btn btn-outline-success btn-sm"> View </Link>
                <Button variant="outline-warning" size="sm" onClick={() => handleEditSite(site)} className="me-3 px-3 shadow-none"> Edit </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteSite(site)} className="me-3 px-3 shadow-none"> Delete </Button>
            </>
        )
    }

    return (
        <div className="main-div">
            {isLoader && <Loader />}
            <div className="header">
                <h4>Sites</h4>
                <div>
                    <Button variant="outline-primary" size="sm" className="px-3 shadow-none" onClick={handleShow}> Add Site </Button>
                </div>
            </div>
            <div className="card">
                <DataTable value={sites} responsiveLayout="scroll">
                    <Column field="uuid" header="Id"></Column>
                    <Column field="site" header="Site Name"></Column>
                    <Column field="version" header="Version"></Column>
                    <Column body={actionTemplate} header="Action"></Column>
                </DataTable>
            </div>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Site</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitHandle)}>
                        <Container>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="site">
                                        <Form.Label>Site Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="enter site name"
                                            className="shadow-none"
                                            name="site"
                                            {...register("site", { required: true })}
                                        />
                                        {errors.site && <small className="error-msg">Site name is required</small>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="version">
                                        <Form.Label>Site Version</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="enter site version"
                                            className="shadow-none"
                                            name="version"
                                            {...register("version", { required: true })}
                                        />
                                        {errors.version && <small className="error-msg">Site version is required</small>}
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

export default CoreData;
