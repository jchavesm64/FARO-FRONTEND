import React from 'react'
import { Container, Row } from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ButtomCardHome from '../../Home/ButtonCardHome';
import { hotelsettings } from '../../../constants/routesConst';

const HotelHomeSettings = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Recepción" />
                    <Row className="flex justify-content-center gap-3">
                        {
                            hotelsettings.map((route, index) => (
                                <ButtomCardHome key={index} route={route} />
                            ))
                        }
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}
export default HotelHomeSettings