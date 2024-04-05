import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import withRouter from '../../components/Common/withRouter';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useParams } from 'react-router-dom';
import { OBTENER_ALMACEN } from '../../services/AlmacenService';
import EditWarehouse from './EditWarehouse';

const EditWarehouseContainer = (props) => {
    

    document.title = "Almacenes | FARO";

    const { id } = useParams();
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_ALMACEN, { variables: { id: id }, pollInterval: 1000 });

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
                        <Breadcrumbs title="Editar almacén" breadcrumbItem="Almacenes" breadcrumbItemUrl='/warehouses'  />
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
            <EditWarehouse props={props} warehouse={data.obtenerAlmacen}/>
        </>
    );
}

export default withRouter(EditWarehouseContainer);