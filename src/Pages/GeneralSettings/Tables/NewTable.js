import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { SAVE_MESA } from "../../../services/MesaService";
import { OBTENER_PISOS } from "../../../services/PisoService";

const NewTable = (props) => {
    document.title = "Mesas | FARO";

    const navigate = useNavigate();

    const [tableNumber, setTableNumber] = useState(0)
    const [tableType, setTableType] = useState({ value: '', label: '' })
    const [tableFloor, setTableFloor] = useState({ value: '', label: '' })

    const { loading, error, data: dataFloors } = useQuery(OBTENER_PISOS, { pollInterval: 1000 });

    const [insertar] = useMutation(SAVE_MESA);

    const [disableSave, setDisableSave] = useState(true);

    const tableTypes = [
        { value: 'Mesa', label: 'Mesa' },
        { value: 'Silla', label: 'Silla / Individual' },
    ]

    useEffect(() => {
        setDisableSave(tableNumber === 0 || tableType === '' || tableFloor === '')
    }, [tableNumber, tableType, tableFloor])

    const getFloors = () => {
        if (dataFloors) {
            return dataFloors.obtenerPisos.map(floor => {
                return { value: floor.id, label: floor.nombre }
            })
        }
    }

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
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMesa;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/tables');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la mesa', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Mesa" breadcrumbItem="Gestión de mesas" breadcrumbItemUrl="/tables" />
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
};

export default NewTable;