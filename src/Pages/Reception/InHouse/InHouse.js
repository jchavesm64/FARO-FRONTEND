import React from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { InHouseRoutes } from "../../../constants/routesConst";
import ButtomCardHome from "../../Home/ButtonCardHome";

const InHouse = () => {
  document.title = "InHouse | FARO";

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="In House" />
        <Row key="receprionHome" className="flex justify-content-center gap-3">
          {InHouseRoutes.map((route, index) => (
            <ButtomCardHome key={`${route}${index}`} route={route} />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default InHouse;
