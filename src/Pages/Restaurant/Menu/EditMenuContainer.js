import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import withRouter from '../../../components/Common/withRouter';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useParams } from 'react-router-dom';
import { OBTENER_MENU } from '../../../services/MenuService';
import EditMenu from './EditMenu';

const EditMenuContainer = (props) => {
    

    document.title = "Menu | FARO";

    const { id } = useParams();
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_MENU, { variables: { id: id }, pollInterval: 1000 });

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
                        <Breadcrumbs title='Editar plato' breadcrumbItem='Menú' breadcrumbItemUrl='/restaurant/menu'  />
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
            <EditMenu props={props} menu={data.obtenerMenu}/>
        </>
    );
}

export default withRouter(EditMenuContainer);