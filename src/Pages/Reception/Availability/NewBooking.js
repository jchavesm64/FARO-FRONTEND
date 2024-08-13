import React from 'react'
import { Container } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />

                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewBooking;