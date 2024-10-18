import React from 'react';
import withRouter from "../../../../../components/Common/withRouter";

const TableAreas = ({ ...props }) => {

    const { data } = props;

    const handleNoteChange = (id, newNota, dateNote) => {

        const updatedNote = data.find(item => item.area.id === id);
        if (updatedNote) {
            props.props.handleSaveNote({ ...updatedNote, nota: newNota, fecha: dateNote });
        }
    };

    return (
        <div className=" mb-3 ">

            <table className="table table-hover table-striped mb-0 col-md-4">
                <thead>
                    <tr>
                        <th className='text-center'>Nombre</th>
                        <th>Nota</th>
                        <th className='text-center'>Fecha</th>

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
                                        onChange={(e) => handleNoteChange(item.area.id, e.target.value, item.fecha)}
                                    />
                                </div>
                            </td>
                            <td className='col-md-3 '>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="checkInDate"
                                    disabled={!item.nota}
                                    value={item.fecha}
                                    onChange={(e) => {
                                        handleNoteChange(item.area.id, item.nota, e.target.value)
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default withRouter(TableAreas);