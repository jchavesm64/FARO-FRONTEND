import React from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import DataList from "../../../../../components/Common/DataList";

const Notes = ({ ...props }) => {

    const { notes, filterNotes, setDisabledButton } = props.props;
    const data = filterNotes && filterNotes.length > 0 ? filterNotes : notes
    setDisabledButton(false);

    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 ">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <Row>
                            <div className="col mb-3">
                                <Card>
                                    <CardBody >
                                        <DataList data={data} type="notes" displayLength={9} {...props} />
                                    </CardBody>
                                </Card>
                            </div>
                        </Row>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Notes;