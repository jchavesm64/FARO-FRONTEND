import React from 'react';
import { Row } from 'reactstrap';
import withRouter from '../../../../components/Common/withRouter';

const TableTypeRoomSeason = ({ ...props }) => {
    const { data } = props;

    const { getFilteredTypeRoomByKey, handlePriceChange, priceTypeRoom } = props.props

    console.log(priceTypeRoom);

    console.log(priceTypeRoom['Actualizado']?.price);

    //data?.forEach((type) => console.log(type.nombre))

    const handlePriceChangeTable = (e, name) => {
        handlePriceChange(e, name);
    };
    const handleSearchTypeRoom = (data) => {
        getFilteredTypeRoomByKey(data)
    };
    return (
        <div className=" mb-3 ">
            <h4>Precios por tipo de habitación</h4>
            <Row className="flex mb-3" style={{ alignItems: 'flex-end' }}>
                <div className="col-md-12 mb-1">
                    <label> Buscar tipo de habitacion</label>
                    <input
                        className="form-control"
                        id="search-input"
                        type="search"
                        placeholder="Escribe el tipo de Habitación"
                        onChange={(e) => { handleSearchTypeRoom(e.target.value) }}
                    />
                </div>
            </Row>
            <table className="table table-hover table-striped mb-0 col-md-4">
                <thead>
                    <tr>
                        <th className='text-center'>Nombre</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((type, i) => (
                        <tr key={`area-${i}`}>
                            <td className='text-center col-md-3'>{type.nombre}</td>
                            <td>
                                <div className='col-md-10 col-sm-12 m-2'>
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
    );
}

export default withRouter(TableTypeRoomSeason);