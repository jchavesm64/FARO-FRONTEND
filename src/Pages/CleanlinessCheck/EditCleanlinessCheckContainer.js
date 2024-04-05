import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import withRouter from '../../components/Common/withRouter';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useParams } from 'react-router-dom';
import { OBTENER_CHEQUEO_ID } from '../../services/ChequeoService';
import EditCleanlinessCheck from './EditCleanlinessCheck';

const EditCleanlinessCheckContainer = (props) => {
    

    document.title = "Chequeos | FARO";

    const { id } = useParams();
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_CHEQUEO_ID, { variables: { id: id }, pollInterval: 1000 });
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
                        <Breadcrumbs title="Revisar chequeo" breadcrumbItem="Chequeos" breadcrumbItemUrl='/cleaningjobs/checks'  />
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
        console.log(error);
        return null
    }

    return (
        <>
            <EditCleanlinessCheck props={props} chequeo={data.obtenerChequeoId}/>
        </>
    );
}

export default withRouter(EditCleanlinessCheckContainer);