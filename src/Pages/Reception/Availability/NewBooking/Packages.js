import React, { useState } from "react";
import Select from "react-select";
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import ListInfo from "../../../../components/Common/ListInfo";
import ListSection from "../../../../components/Common/ListSelection";
import EditPackage from "../../../GeneralSettings/Hotel/AdminPackage/EditPackage";

const Packages = ({ ...props }) => {

    const { handlePackage, getPackage, addPackage, deletePackage, setDisabledButton, updatePackageBooking, packageBooking, packageBookingList } = props.props;
    setDisabledButton(false);

    const [modal, setModal] = useState(false);
    const [filter, setFilter] = useState(null)
    const toggle = () => setModal(!modal);

    const showModalEditPackage = (data) => {
        
        setFilter(data)
        setModal(true);
    };

    const updatePackage = (packageUpdate) => {
        updatePackageBooking(packageUpdate)
        setModal(false);
    };

    return (
        <React.Fragment>
            <div className="page-content p-4 border m-2">
                <Container fluid={true}>
                    <Row>
                        <Col>
                            <Card className='col-md-12 bg-light m-2 p-2 '>
                                <div className="col-md-12">
                                    <h3 key='summary' className="text-center mb-4 mt-4">Paquetes adicionales por reserva</h3>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Card className="p-2">
                                        <CardBody>
                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                <div className="col-xl-9 col-md-12 mb-2">
                                                    <Select
                                                        value={packageBooking}
                                                        onChange={(e) => {
                                                            handlePackage(e);
                                                        }}
                                                        options={getPackage()}
                                                        placeholder="Paquetes"
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <Button type="submit" className="btn btn-outline-primary" onClick={() => { addPackage() }}>
                                                        Agregar
                                                    </Button>
                                                </div>
                                            </div>
                                            <Row>
                                                <ListInfo data={packageBookingList} headers={['Paquete ', 'Precio']} keys={['nombre', 'precio']} enableEdit={true} enableDelete={true} actionDelete={deletePackage} actionEdit={showModalEditPackage} mainKey={'nombre'} secondKey={'precio'} />
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                            </Card>
                        </Col>
                        <Col>
                            <Card className='col-md-12 bg-light m-2 p-2 '>
                                <div className="col-md-12">
                                    <h3 key='summary' className="text-center mb-4 mt-4">Paquetes selecionados</h3>
                                    <Card className="col-md-12 bg-tertiary rounded p-3" style={{ height: '500px', overflowY: 'auto' }}>
                                        {packageBookingList.length > 0 ? (
                                            <div className='mt-2'>
                                                {packageBookingList.map(pack => (
                                                    <div key={pack.nombre} className="m-0 d-flex justify-content-between p-1">
                                                        <div className='col-md-12 border shadow_wizard rounded p-3'>
                                                            <label className="fs-4 m-0 label_package_color">
                                                                <strong>Paquete:</strong> <span className="fs-5 span_package_color">{pack.nombre}</span>
                                                            </label>

                                                            <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                <label className="fs-5 m-0 ms-4 label_package_color">
                                                                    <strong>Tipo:</strong> <span className="fs-5 span_package_color">{pack.tipo}</span>
                                                                </label>
                                                                <label className="fs-5 m-0 ms-4 label_package_color">
                                                                    <strong>Temporada:</strong> <span className="fs-5 span_package_color">{pack.temporadas?.nombre}</span>
                                                                </label>
                                                                <ListSection
                                                                    title="Servicios"
                                                                    items={pack.servicios}
                                                                    label="Nombre"
                                                                    emptyMessage="Sin datos"
                                                                    showExtra={true}
                                                                />
                                                                <ListSection
                                                                    title="Tours"
                                                                    items={pack.tours}
                                                                    label="Nombre"
                                                                    emptyMessage="Sin datos"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                <label>Sin datos que mostrar</label>
                                            </div>
                                        )}


                                    </Card>

                                </div>

                            </Card>
                        </Col>
                    </Row>

                    <Modal key='modalCustomer' isOpen={modal} toggle={toggle} size='xl'>
                        <ModalHeader key='modalheader' toggle={toggle}><span className="fs-4 m-0 span_package_color">Editar paquete</span></ModalHeader>
                        <ModalBody key='modalbody'>
                            <EditPackage idBooking={filter?.id} updatePackage={updatePackage} />
                        </ModalBody>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Packages;