import React from "react";
import { Container, Row } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { restaurantRoutes } from "../../constants/routesConst";
import ButtomCardHome from "../Home/ButtonCardHome";

const RestaurantHome = () => {
  document.title = "Restaurante | FARO";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Restaurante"  />
          <Row className="flex justify-content-center gap-3">
                {
                    restaurantRoutes.map((route, index) => (
                        <ButtomCardHome key={index} route={route}/> 
                    ))
                }
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RestaurantHome;
