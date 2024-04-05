import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import withRouter from '../../components/Common/withRouter';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useParams } from 'react-router-dom';
import { OBTENER_MATERIA_PRIMA } from '../../services/MateriaPrimaService';
import EditProduct from './EditProduct';

const EditProductContainer = (props) => {
    

    document.title = "Inventario | FARO";

    const { stockType, id } = useParams();
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_MATERIA_PRIMA, { variables: { id: id }, pollInterval: 1000 });

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
                    <Breadcrumbs title='Editar producto' breadcrumbItem={`Inventario - ${stockType}`} breadcrumbItemUrl={`/stock/${stockType}`}  />
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
            <EditProduct props={props} stockType={stockType} product={data.obtenerMateriaPrima}/>
        </>
    );
}

export default withRouter(EditProductContainer);