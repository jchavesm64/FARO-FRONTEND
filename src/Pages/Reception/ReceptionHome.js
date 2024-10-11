import React from 'react'
import { Container, Row } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { receptionRoutes } from "../../constants/routesConst";
import ButtomCardHome from "../Home/ButtonCardHome";

export default function ReceptionHome() {
    document.title = "Recepción | FARO";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Recepción" />
                    <Row  key='receprionHome' className="flex justify-content-center gap-3">
                        {
                            receptionRoutes.map((route, index) => (
                                <ButtomCardHome key={`${route}${index}`} route={route} />
                            ))
                        }
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}