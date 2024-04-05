import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { infoAlert } from "../../helpers/alert";
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { GUARDAR_ALMACEN } from "../../services/AlmacenService";


const NewWarehouse = (props) => {
    document.title = "Almacenes | FARO";

    const navigate = useNavigate();

    const [insertar] = useMutation(GUARDAR_ALMACEN);

    const [nombre, setNombre] = useState(null)
    const [descripcion, setDescripcion] = useState(null)

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!nombre || nombre === null || nombre.trim().length === 0)
    }, [nombre])


    const onSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                estado: 'ACTIVO',
                nombre: nombre,
                descripcion: descripcion,
            }

            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarAlmacen;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/warehouses`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el producto', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Almacén nuevo' breadcrumbItem='Almacenes' breadcrumbItemUrl='/warehouses' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-5 mb-3">
                            <label htmlFor="nombre" className="form-label">* Nombre</label>
                            <input className="form-control" type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div className="col-7 mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción del almacén</label>
                            <textarea className="form-control" type="text" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewWarehouse;
