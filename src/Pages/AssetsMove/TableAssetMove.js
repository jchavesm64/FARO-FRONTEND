import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import { getFechaTZ } from '../../helpers/helpers';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Row, Modal, ModalHeader, ModalBody } from 'reactstrap';


const TableAssets = ({ ...props }) => {
    const { data, mode } = props;
    const [modal, setModal] = useState(false);
    const [selectedMove, setSelectedMove] = useState([]);

    const toggle = () => setModal(!modal);

    const showAssetsModal = (move) => {
        setSelectedMove({
            activos: move.activos,
            beneficiario: move.beneficiario,
            fecha: move.fecha,
            tipo: move.tipo,
            consecutivo: move.consecutivo.consecutivo
        });
        toggle();
    };

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Identificador</th>
                        <th>Beneficiario</th>
                        <th>Fecha y Hora de Registro</th>
                        {mode === 'all' &&
                            <>
                                <th>Activos</th>
                                <th>Referencia Interna</th>
                                <th></th>
                            </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((move, i) => (
                            <tr key={`assetMove-${i}`}>
                                <td>
                                    {
                                        move.tipo === 'ENTRADA' ?
                                            <i className="mdi mdi-plus align-middle" style={{ color: '#0AC074' }}></i>
                                            :
                                            <i className="mdi mdi-minus align-middle" style={{ color: '#FF3D60' }}></i>
                                    }
                                </td>
                                <td>{move.consecutivo ? move.consecutivo.consecutivo : ""}</td>
                                <td>{move.beneficiario}</td>
                                <td>{getFechaTZ('fechaHora', move.fecha)}</td>
                                {mode === 'all' &&
                                    <>
                                        <td>{
                                            move.activos[0].nombre + (move.activos.length > 1 ? ', ... ' + (move.activos.length - 1) + ' más' : '')
                                        }</td>
                                        <td>{
                                            move.activos[0].referenciaInterna + (move.activos.length > 1 ? ', ... ' + (move.activos.length - 1) + ' más' : '')
                                        }</td>
                                        <td>
                                            <div className="d-flex">
                                                <ButtonIconTable icon='mdi mdi-eye' color='info' onClick={() => showAssetsModal(move)} />
                                            </div>
                                        </td>
                                    </>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>
                    {selectedMove.consecutivo}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="tipo" className="form-label">Tipo</label>
                            <input className="form-control" disabled type="text" id="tipo" value={selectedMove.tipo} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="beneficiario" className="form-label">Beneficiario</label>
                            <input className="form-control" disabled type="text" id="beneficiario" value={selectedMove.beneficiario} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="fecha" className="form-label">Fecha</label>
                            <input className="form-control" disabled type="text" id="fecha" value={selectedMove.fecha ? getFechaTZ('fechaHora', selectedMove.fecha) : ''} />
                        </div>
                    </Row>
                    <div className="table-responsive mb-3">
                        <table className="table table-hover table-striped mb-0">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Referencia Interna</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    selectedMove.activos?.map((asset, i) => (
                                        <tr key={`asset-${i}`}>
                                            <td>{asset.nombre}</td>
                                            <td>{asset.referenciaInterna}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </ModalBody>
            </Modal>

        </div>
    )


}

export default withRouter(TableAssets)