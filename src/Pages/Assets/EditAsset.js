import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ACTUALIZAR_ACTIVO, OBTENER_ACTIVO } from '../../services/ActivosService';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { infoAlert } from '../../helpers/alert';
import Select from "react-select";

//TODO: Make sure if unit of the asset is necessary
const EditAsset = () => {
    document.title = "Activos | FARO";


    const navigate = useNavigate();
    const { id } = useParams();

    const { loading: loading_asset, error: error_asset, data: data_asset, startPolling, stopPolling } = useQuery(OBTENER_ACTIVO, { variables: { id: id }, pollInterval: 1000 })
    const [actualizar] = useMutation(ACTUALIZAR_ACTIVO);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    useEffect(() => {
        if (data_asset) {
            setNombre(data_asset.obtenerActivo.nombre)
            setReferenciaInterna(data_asset.obtenerActivo.referenciaInterna)
            //setUnidad({ label: data_asset.obtenerActivo.unidad, value: data_asset.obtenerActivo.unidad })
        }
    }, [data_asset])

    const [nombre, setNombre] = useState('');
    const [referenciaInterna, setReferenciaInterna] = useState('');
    //const [unidad, setUnidad] = useState(null)

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!nombre /*|| !unidad*/ || nombre.trim().length === 0)
    }, [nombre/*, unidad*/])

    const onSaveAsset = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre,
                //unidad: unidad.value,
                estado: 'ACTIVO',
                referenciaInterna: referenciaInterna,
            }
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarActivo;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/assets`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el activo', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title={"Editar activo"} breadcrumbItem={"Activos"} breadcrumbItemUrl={"/assets"} />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSaveAsset} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-3 col-sm-6 mb-3">
                            <label htmlFor="nombre" className="form-label">* Nombre</label>
                            <input className="form-control" type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        {/*<div className="col-md-2 mb-3">
                            <label htmlFor="unidad" className="form-label">* Unidad de medida</label>
                            <Select
                                menuPosition="fixed"
                                id="unidad"
                                value={unidad}
                                onChange={(e) => setUnidad(e)}
                                options={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }, { label: 'Unidades', value: 'Unidades' }]}
                                classNamePrefix="select2-selection"
                            />
                        </div>*/}
                        <div className="col-md-3 col-sm-6 mb-3">
                            <label htmlFor="refInterna" className="form-label">Referencia interna</label>
                            <input className="form-control" type="text" id="refInterna" value={referenciaInterna} onChange={(e) => setReferenciaInterna(e.target.value)} />
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default EditAsset;

