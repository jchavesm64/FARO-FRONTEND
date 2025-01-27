import React, { useState, useEffect } from 'react';
import { Container, Row, Card, CardHeader, FormGroup, Label, CardTitle, CardBody, Badge, Input, Button, Col } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';

const Reposts = () => {

    document.title = "Reportes | FARO";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Reportes" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />
                </Container>
            </div>
        </React.Fragment>


    );
};

export default Reposts;