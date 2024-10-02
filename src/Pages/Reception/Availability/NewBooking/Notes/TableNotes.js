import React from 'react';
import withRouter from "../../../../../components/Common/withRouter";
import Breadcrumbs from '../../../../../components/Common/Breadcrumb';

const TableAreas = ({ ...props }) => {

    const { data } = props;

    const handleNoteChange = (id, newNota) => {
        const updatedNote = data.find(item => item.area.id === id);
        if (updatedNote) {
            props.props.handleSaveNote({ ...updatedNote, nota: newNota });
        }
    };

    // se desactiva la busqueda, se debe retomar despues 
    /* const handleSearchAreas = (data) => {
        props.props.getFilteredAreaByKey(data)
    };
    <Row className="flex mb-3" style={{ alignItems: 'flex-end' }}>
                    <div className="col-md-12 mb-1">
                        <label> Busca el área</label>
                        <input
                            className="form-control"
                            id="search-input"
                            type="search"
                            placeholder="Escribe el nombre del área"
                            onChange={(e) => { handleSearchAreas(e.target.value) }}
                        />
                    </div>
                </Row> */
    return (
        <div className=" mb-3 ">
            <Breadcrumbs title="Notas por área operativa" />

            <table className="table table-hover table-striped mb-0 col-md-4">
                <thead>
                    <tr>
                        <th className='text-center'>Nombre</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item, i) => (
                        <tr key={`area-${i}`}>
                            <td className='text-center col-md-3'>{item.area.nombre}</td>
                            <td>
                                <div className='col-md-10 col-sm-12 m-2'>
                                    <textarea
                                        type="textarea"
                                        className="form-control "
                                        placeholder="Agregar nota..."
                                        value={item.nota}
                                        onChange={(e) => handleNoteChange(item.area.id, e.target.value)}
                                    />
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default withRouter(TableAreas);