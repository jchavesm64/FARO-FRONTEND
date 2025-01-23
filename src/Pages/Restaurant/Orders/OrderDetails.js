import React from 'react';
import { useTimer } from '../../../hooks/useTimer';
import { Row, Col, Button } from 'reactstrap';
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import DataList from "../../../components/Common/DataList";

const OrderDetails = ({ table, onDelete, onDeleteOrder, onTransfer, transferMode, onCreateOrder, onBill, createdAt }) => {
    /*const { elapsedTime, start } = useTimer();

    React.useEffect(() => {
        if (table && table.orders && table.orders.length > 0) {
            //start(new Date(createdAt));
        }
    }, [table, start]);*/

    const formatTotal = (orders) => {
        if (!orders) return '₡0,00';
        let total = 0;
        orders.forEach((order) => {
            total += order.precio * order.cantidad;
        });
        let totalStr = total.toFixed(2);
        let [integerPart, decimalPart] = totalStr.split('.');
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `₡${integerPart},${decimalPart}`;
    };

    return (
        <>
            <Row>
                <SpanSubtitleForm subtitle={table ? (table.isChair ? `Silla ${table.name}` : `${table.name}`) : `\u00A0`} />
            </Row>
            <SpanSubtitleForm subtitle={table ? `Total: ${formatTotal(table?.orders)}` : `Por favor selecciona una mesa o silla`} />
            <Row className="mb-3">
                <Col md={12}>
                    {/*<span>{table ? `Tiempo transcurrido: ${elapsedTime}` : `\u00A0`}</span>*/}
                    {transferMode &&
                        <>
                            <br />
                            <SpanSubtitleForm subtitle={"Presione otra mesa para transferir la comanda"} />
                        </>
                    }
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <Button
                        color="success"
                        disabled={!table}
                        style={{ width: '100%' }}
                        onClick={onCreateOrder}
                    >
                        Comanda
                    </Button>
                </Col>
                <Col md={6}>
                    <Button
                        color="cyan-dark"
                        style={{ width: '100%' }}
                        onClick={onBill}
                    >
                        {table ? `Facturar` : `Facturar sin mesa`}
                    </Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <Button
                        color="indigo"
                        disabled={!table?.orders?.length}
                        style={{ width: '100%' }}
                        onClick={onTransfer}
                    >
                        {transferMode ?
                            <>
                                <i className="mdi mdi-close"></i> Cancelar
                            </> :
                            <>
                                <i className="mdi mdi-swap-vertical"></i> Transferir
                            </>
                        }
                    </Button>
                </Col>
                <Col md={6}>
                    <Button
                        color="danger"
                        disabled={!table?.orders?.length}
                        style={{ width: '100%' }}
                        onClick={() => onDeleteOrder()}
                    >
                        <i className="mdi mdi-trash-can-outline"></i> Eliminar
                    </Button>
                </Col>
            </Row>
            {
                table?.orders?.length > 0 && (
                    <>
                        <Row className="text-md-center my-3">
                            <SpanSubtitleForm subtitle="Detalles de la cuenta" />
                        </Row>
                        <Row>
                            <DataList onDelete={onDelete} data={table?.orders} type="orders" displayLength={9} />
                        </Row>
                    </>
                )
            }
        </>
    );
};

export default OrderDetails;