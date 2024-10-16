import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import withRouter from '../../../../components/Common/withRouter';

const TableTypeRoomSeason = ({ ...props }) => {
    const { data } = props;

    const { getFilteredTypeRoomByKey, handlePriceChange, priceTypeRoom } = props.props

    const handlePriceChangeTable = (e, name) => {
        handlePriceChange(e, name);
    };
    const handleSearchTypeRoom = (data) => {
        getFilteredTypeRoomByKey(data)
    };
    return (
        <Card className='p-4 shadow_service'>
            <div className=" mb-3 d-flex justify-content-center flex-wrap ">
                <Row>
                    <h4>Precios por tipo de habitación</h4>
                </Row>
                <Row className='d-flex justify-content-between' >
                    <Col className='col-md-12 d-flex justify-content-center flex-wrap'>
                        <div className="col-md-12 col-sm-9 m-2">
                            <label> Buscar tipo de habitacion</label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el tipo de Habitación"
                                onChange={(e) => { handleSearchTypeRoom(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-12 col-sm-9 m-2">
                            <table className="table table-hover table-striped mb-0 ">
                                <thead>
                                    <tr className='col-md-6'>
                                        <th className='text-center '>Nombre</th>
                                        <th >Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((type, i) => (
                                        <tr key={`area-${i}`}>
                                            <td className='text-center col-md-3'>{type.nombre}</td>
                                            <td>
                                                <div className='col-md-6 col-sm-12 m-2 '>
                                                    <input
                                                        type="textarea"
                                                        className="form-control "
                                                        value={priceTypeRoom[type.nombre]?.price}
                                                        onChange={(e) => handlePriceChangeTable(e, type.nombre)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>

            </div>
        </Card>
    );
}

export default withRouter(TableTypeRoomSeason);