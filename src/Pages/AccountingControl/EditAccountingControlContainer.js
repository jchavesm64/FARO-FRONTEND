import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { OBTENER_REGISTRO_CONTABLE } from '../../services/RegistroContableService';
import withRouter from '../../components/Common/withRouter';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useParams } from 'react-router-dom';
import EditAccountingControl from './EditAccountingControl';

const EditAccountingControlContainer = (props) => {

    const { id, tipo } = useParams();
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_REGISTRO_CONTABLE, { variables: { id: id }, pollInterval: 1000 });

    useEffect( () => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if(loading){
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar registro contable" breadcrumbItem="Registro contable" breadcrumbItemUrl='/accountingcontrol'  />
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
    if(error){
        return null
    }

    return (
        <>
            <EditAccountingControl props={props} accountingControl={data.obtenerRegistroContable} tipo={tipo}/>
        </>
    );
}

export default withRouter(EditAccountingControlContainer);