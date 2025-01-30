import React from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const InHouse = () => {
  document.title = "InHouse | FARO";
  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title="InHouse"
          breadcrumbItem="Recepción"
          breadcrumbItemUrl="/reception"
        />
      </Container>
    </div>
  );
};

export default InHouse;
