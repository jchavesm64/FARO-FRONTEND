import React, { useEffect, useState } from 'react';
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { Modal, ModalHeader, ModalBody, Row } from 'reactstrap';

const TableOrders = ({ data, onDelete }) => {
    const [modal, setModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [observations, setObservations] = useState({});
   
    const onClickView = (order) => {
        setSelectedOrder(order);
        setObservations((prev) => ({
            ...prev,
            [order._id]: order.observaciones || '',  
        }));
        setModal(true);
    };

    const toggle = () => setModal(!modal);

    const handleObservationChange = (e) => {
        const { value } = e.target;
        setObservations((prev) => ({
            ...prev,
            [selectedOrder._id]: value,
        }));
    };

    return (
        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.filter(order => order.estado !== 'Cancelado').map((order, i) => (
                        <tr key={`menu-${i}`}>
                            <td>{order.nombre}</td>
                            <td>₡{order.precio}</td>
                            <td className="text-center">{order.estado}</td>
                            <td className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => onClickView(order)}
                                >
                                    <i className="mdi mdi-eye align-middle"></i>
                                </button>
                            </td>
                            <td>₡{order.precio}</td>
                            <td>
                                <ButtonIconTable
                                    icon="mdi mdi-delete"
                                    color="danger"
                                    onClick={() => onDelete(order.subcuenta, order._id, order.nombre, order.estado)}
                                    disabled={order.estado !== 'Pendiente'}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <Modal isOpen={modal} toggle={toggle} size="md">
                    <ModalHeader toggle={toggle}>
                        {selectedOrder.nombre}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="observations" className="form-label">Observaciones</label>
                                <textarea
                                    className="form-control"
                                    id="observations"
                                    value={observations[selectedOrder._id] || ''}
                                    placeholder="Sin cebolla, con mayonesa extra..."
                                    rows="4"
                                    disabled
                                />
                            </div>
                        </Row>
                    </ModalBody>
                </Modal>
            )}

        </div>
    );
};

export default withRouter(TableOrders);
