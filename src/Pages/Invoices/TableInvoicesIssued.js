import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import { getFechaTZ } from '../../helpers/helpers';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Row, Modal, ModalHeader, ModalBody } from 'reactstrap';


const TableInvoicesIssued = ({ ...props }) => {
    const { data, mode } = props;


    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Factura Identificación</th>
                        <th>Receptor Nombre</th>
                        <th>Receptor Identificación</th>
                        <th>Fecha Emición</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((invoice, i) => (
                            <tr key={`invoiceIssued-${i}`}>
                                <td>{invoice.response.NumeroConsecutivo}</td>
                                <td>{invoice.data.DocElectronicos.length > 0 ? invoice.data.DocElectronicos[0].Encabezado.Receptor.Nombre : null}</td>
                                <td>{invoice.data.DocElectronicos.length > 0 ? invoice.data.DocElectronicos[0].Encabezado.Receptor.IdentificacionNumero : null}</td>
                                <td>{getFechaTZ('fechaHora', invoice.response.Fecha)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    )


}

export default withRouter(TableInvoicesIssued)