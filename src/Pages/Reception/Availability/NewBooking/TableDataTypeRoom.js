import withRouter from "../../../../components/Common/withRouter"

const TableDataTypeRoom = ({ ...props }) => {
    const { data } = props;


    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Habitación</th>
                        <th className="text-center">Cantidad total</th>
                        <th className="text-center">Cantidad disponible</th>
                        <th className="text-center">Cantidad reservados</th>
                        <th className="text-center">% de disponibilidad</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((room, i) => (
                            <tr key={`TypeRoomData-${i}`}>
                                <td  >{room.nombre}</td>
                                <td className="text-center">{room.cantidadTotal}</td>
                                <td className="text-center">{room.cantidadDisponible}</td>
                                <td className="text-center">{room.cantidadReservadas}</td>
                                <td className="text-center">{room.porcentajeDisponible}%</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default withRouter(TableDataTypeRoom)