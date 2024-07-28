import React from "react";
import { Card, CardTitle, Col, Row } from "reactstrap";

import { Link } from "react-router-dom";

const ButtomCardHome = ({ props, route }) => {
    return (
        <Link to={route.link} style={{ textDecoration: 'none' }} className="card_home_link">
            <Card className="card_home">
                <Row>
                    <Col className="text-center">
                        <i className={route.icon + ' card_home_icon'}></i>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <CardTitle className="card_home_title">
                            {route.label}
                        </CardTitle>
                    </Col>
                </Row>

            </Card>
        </Link>
    );
};

export default ButtomCardHome;
