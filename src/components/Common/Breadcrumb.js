import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "reactstrap";

const Breadcrumbs = (props) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs="12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">{props.title}</h4>
            <div className="page-title-right">
              <Breadcrumb listClassName="m-0">
                {
                  props.breadcrumbItem &&
                  <BreadcrumbItem active>
                    <Link to={props.breadcrumbItemUrl}>{props.breadcrumbItem}</Link>
                  </BreadcrumbItem>
                }
                <BreadcrumbItem>
                  <Link to="#">{props.title}</Link>
                </BreadcrumbItem>
                
                
              </Breadcrumb>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}



export default Breadcrumbs;
