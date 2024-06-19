import React, { useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import withRouter from '../../components/Common/withRouter';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useParams } from 'react-router-dom';
import EditInternTransfer from './EditInternTransfer';
import { OBTENER_TRANSFERENCIA } from '../../services/TransferenciaInternaService';
import { useReactToPrint } from "react-to-print";

const EditInternTransferContainer = (props) => {


    document.title = "Transferencias internas | FARO";

    const { id } = useParams();
    const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_TRANSFERENCIA, { variables: { id: id }, pollInterval: 1000 });

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => {
            const container = document.createElement('div');
            container.className = 'container mt-5';
            container.innerHTML = componentRef.current.outerHTML +
                `<div class="col-12 mt-5">
                    <span class="mb-3">Firma de quien entrega: ${'_'.repeat(47)}</span>
                </div>
                <div class="col-12 mt-5">
                    <span class="mb-3">Firma de quien recibe: ${'_'.repeat(48)}</span>
                </div>`;
            return container;
        },
    });

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if (loading) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Ver transferencia interna' breadcrumbItem='Transferencias internas' breadcrumbItemUrl='/internTransfers' />
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
    if (error) {
        return null;
    }

    return (
        <>
            <EditInternTransfer ref={componentRef} {...props} internTransfer={data.obtenerTransferenciaInterna} />
            <Row>
                <div className="ms-3 text-start">
                    <button onClick={handlePrint} type="button" className="btn btn-primary waves-effect waves-light" >
                        Imprimir{" "}
                        <i className="ri-save-line align-middle ms-2"></i>
                    </button>
                </div>
            </Row>
        </>
    );
}

export default withRouter(EditInternTransferContainer);