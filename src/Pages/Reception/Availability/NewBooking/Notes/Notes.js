import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import DataList from "../../../../../components/Common/DataList";
import Breadcrumbs from "../../../../../components/Common/Breadcrumb";

const Notes = ({ ...props }) => {

    const { notes, filterNotes, setDisabledButton } = props.props;
    const data = filterNotes && filterNotes.length > 0 ? filterNotes : notes

    const [filter, setFilter] = useState('');

    const getData = () => {
        if (data) {
            return data.filter(value => {
                if (filter !== '') {
                    return getFilteredByKey(value, filter)
                };
                return value;
            })
        }
    };

    const getFilteredByKey = (note, value) => {

        const valName = note.area.nombre.toLowerCase();
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return note;
        };
        return null;
    };

    const notesData = getData();

    setDisabledButton(false);

    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 ">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <Breadcrumbs title="Notas por área operativa" />
                        <Row className="d-flex justify-content-center flex-wrap" >
                            <div className="col-md-12 mb-1">
                                <label> Busca el área</label>
                                <input
                                    className="form-control"
                                    id="search-input"
                                    type="search"
                                    placeholder="Escribe el nombre del área"
                                    onChange={(e) => { setFilter(e.target.value) }}
                                />
                            </div>
                        </Row>
                        <Row>
                            <div className="col mb-3">
                                <Card>
                                    <CardBody >
                                        <DataList data={notesData} type="notes" displayLength={9} {...props} />
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