import React, { useState, useEffect } from 'react';
import { Container, Row, Card, CardHeader, FormGroup, Label, CardTitle, CardBody, Badge, Input, Button, Col } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';

const InHouse = () => {

    document.title = "InHouse | FARO";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="InHouse" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />
                </Container>
            </div>
        </React.Fragment>


    );
};

export default InHouse;