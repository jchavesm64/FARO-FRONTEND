import React, { useEffect, useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import { getFechaTZ } from '../../helpers/helpers';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Row, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '../../services/FacturasParametrosService';
import { useQuery } from '@apollo/client';


const TableInvoicesIssued = ({ ...props }) => {
    const { data, mode } = props;

    const [dataMap, setDataMap] = useState([]);

    const { data: dataDocumentTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'documentTypes' }, pollInterval: 1000 })

    const getEstadoHacienda = async (data, index) => {
        setDataMap(prevItems => {
            const newItems = [...prevItems];
            const itemCopy = {
                ...newItems[index],
                response: {
                    ...newItems[index].response,
                    EstadoHacienda: "SPINNER"
                }
            };
            newItems[index] = itemCopy;
            return newItems;
        });

        const myHeaders = new Headers();

        const formdata = new FormData();
        formdata.append("document_num_consecutive", data.NumeroConsecutivo);
        formdata.append("document_pass", data.Clave);

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
        };

        const response = await fetch("http://localhost/get/document", requestOptions);
        const res = await response.json();
        if (res.result) {

            setDataMap(prevItems => {
                const newItems = [...prevItems];
                const itemCopy = {
                    ...newItems[index],
                    response: {
                        ...newItems[index].response,
                        EstadoHacienda: res.response.DescripcionEstado
                    }
                };
                newItems[index] = itemCopy;
                return newItems;
            });
            console.log(res.response.DescripcionEstado)
            if (res.response.DescripcionEstado === "Aceptado"){
                return true;
            }else{
                return false;
            }
        }

        setDataMap(prevItems => {
            const newItems = [...prevItems];
            const itemCopy = {
                ...newItems[index],
                response: {
                    ...newItems[index].response,
                    EstadoHacienda: "SIN ESTADO"
                }
            };
            newItems[index] = itemCopy;
            return newItems;
        });

        return false;
    }

    useEffect(() => {
        setDataMap(data)
    }, [data])


    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Factura Identificación</th>
                        <th>Tipo</th>
                        <th>Receptor Nombre</th>
                        <th>Receptor Cédula</th>
                        <th>Estado Hacienda</th>
                        <th>Fecha Emición</th>
                        {props.actions ? <th>Acciones</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {
                        dataMap.map((invoice, i) => {
                            return (
                                <tr key={`invoiceIssued-${i}`}>
                                    <td>{invoice.response.NumeroConsecutivo}</td>
                                    <td>{invoice.data.DocElectronicos.length > 0 ?  dataDocumentTypes.obtenerFacturasParametrosByType.find(item => item.id === invoice.data.DocElectronicos[0].Encabezado.TipoDocumento).value : null}</td>
                                    <td>{invoice.data.DocElectronicos.length > 0 ? invoice.data.DocElectronicos[0].Encabezado.Receptor.Nombre : null}</td>
                                    <td>{invoice.data.DocElectronicos.length > 0 ? invoice.data.DocElectronicos[0].Encabezado.Receptor.IdentificacionNumero : null}</td>
                                    <td>
                                        {!invoice.response.EstadoHacienda ? 
                                            <button type="button" className="btn btn-rounded btn-info waves-effect waves-light me-3" onClick={()=>{getEstadoHacienda(invoice.response, i)}}>
                                                <i className="mdi mdi-magnify"></i>
                                            </button>
                                            :
                                            <>
                                            {invoice.response.EstadoHacienda === "SPINNER" ? 
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            :
                                                <>
                                                {invoice.response.EstadoHacienda === "SIN ESTADO" ? 
                                                    <div className="d-flex" style={{gap: "20px"}}>
                                                        <div>
                                                            {invoice.response.EstadoHacienda}
                                                        </div>
                                                        <button type="button" className="btn btn-rounded btn-info waves-effect waves-light me-3" onClick={()=>{getEstadoHacienda(invoice.response, i)}}>
                                                            <i className="mdi mdi-magnify"></i>
                                                        </button>
                                                    </div>
                                                :
                                                    invoice.response.EstadoHacienda
                                                }
                                                </>
                                            }
                                            </>
                                        }
                                    </td>
                                    <td>{getFechaTZ('fechaHora', invoice.response.Fecha)}</td>
                                    {props.actions ? <td><ButtonIconTable icon='mdi mdi-pencil' color='warning' onClick={async ()=>{var value = await getEstadoHacienda(invoice.response, i); console.log(value); if(value) {props.toggleNota(invoice)} else {props.toggleNota(false)} }} /></td> : null}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        </div>
    )


}

export default withRouter(TableInvoicesIssued)