import React from "react";
import { Container, Row } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { menuRoutes } from "../../constants/routesConst";
import ButtomCardHome from "./ButtonCardHome";

const Home = () => {
  document.title = "Inicio | FARO";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Inicio"  />
          <Row className="flex justify-content-center gap-3 pb-3">
                {
                    menuRoutes.map((route, index) => (
                        <ButtomCardHome key={index} route={route}/> 
                    ))
                }
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Home;
