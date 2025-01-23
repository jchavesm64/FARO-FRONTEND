import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_MESA_BY_ID, UPDATE_MESA } from "../../../services/MesaService";
import { OBTENER_PISOS } from "../../../services/PisoService";


const EditTable = (props) => {
    document.title = "Mesas | FARO";

    const navigate = useNavigate();

    const [tableNumber, setTableNumber] = useState('')
    const [tableType, setTableType] = useState(null)
    const [tableFloor, setTableFloor] = useState(null)

    const tableTypes = [
        { value: 'Mesa', label: 'Mesa' },
        { value: 'Silla', label: 'Silla / Individual' },
    ]

    const { id } = useParams();

    const { loading: loading_table, error: error_table, data: data_table, startPolling, stopPolling } = useQuery(OBTENER_MESA_BY_ID, { variables: { id: id }, pollInterval: 1000 })
    const { loading, error, data: dataFloors } = useQuery(OBTENER_PISOS, { pollInterval: 1000 });

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [actualizar] = useMutation(UPDATE_MESA);

    useEffect(() => {
        if (data_table && dataFloors) {
            console.log(data_table)
            setTableNumber(data_table.obtenerMesaById.numero);
            const matchingTableType = tableTypes.find(type => type.value === data_table.obtenerMesaById.tipo);
            if (matchingTableType) {
                setTableType(matchingTableType);
            }
            const matchingFloor = dataFloors.obtenerPisos.find(floor => floor.id === data_table.obtenerMesaById.piso.id);
            if (matchingFloor) {
                setTableFloor({ value: matchingFloor.id, label: matchingFloor.nombre });
            }
        }
    }, [data_table, dataFloors]);

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(tableNumber === '' || tableType.value === '' || tableFloor.value === '')
    }, [tableNumber, tableType, tableFloor])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                numero: tableNumber,
                tipo: tableType.value,
                piso: tableFloor.value,
                ubicacion: { x: 0, y: 0 },
                estado: "ACTIVO",
                disponibilidad: "LIBRE",
                temporizador: 0
            }
            const id = data_table.obtenerMesaById.id
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMesa;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/tables');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al actualizar la mesa', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const getFloors = () => {
        if (dataFloors) {
            return dataFloors.obtenerPisos.map(floor => {
                return { value: floor.id, label: floor.nombre }
            })
        }
    }

    if (loading_table) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Mesa" breadcrumbItem="Gestión de Mesas" breadcrumbItemUrl="/tables" />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );

    }
    if (error_table) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar Mesa" breadcrumbItem="Gestión de mesas" breadcrumbItemUrl="/tables" />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-12 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información de la mesa' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="number" className="form-label">* Número de la mesa</label>
                                    <input className="form-control" type="number" id="number" value={tableNumber} onChange={(e) => { setTableNumber(parseInt(e.target.value)) }} />
                                </div>
                                <div className="col mb-4">
                                    <label htmlFor="tipo" className="form-label">* Tipo de mesa</label>
                                    <Select
                                        id="tipo"
                                        value={tableType}
                                        onChange={(e) => {
                                            setTableType(e);
                                        }}
                                        options={tableTypes}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="col mb-4">
                                    <label htmlFor="piso" className="form-label">* Piso al que pertenece</label>
                                    <Select
                                        id="piso"
                                        value={tableFloor}
                                        onChange={(e) => {
                                            setTableFloor(e);
                                        }}
                                        options={getFloors()}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditTable;