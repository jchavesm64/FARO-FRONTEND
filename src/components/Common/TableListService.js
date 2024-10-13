import React from 'react'
import ButtonIconTable from './ButtonIconTable';
import { UncontrolledTooltip } from 'reactstrap';

const TabeListService = ({ data, headers, keys, enableDelete, actionDelete, enableAmount, enableEdit, actionEdit, actionAmount, mainKey, secondKey, type, amount }) => {


    const onDelete = (element) => {
        if (!secondKey) {
            actionDelete(element[mainKey])
        } else {
            actionDelete(element[mainKey], element[secondKey])
        }

    };

    const onUpdateAmount = (amount, service) => {
        actionAmount(type, amount, service);
    };

    const onEdit = (element) => {
        actionEdit(element,type)
    };

    return (
        <div className="col table-responsive">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        {
                            headers.map((header, index) => (
                                <th key={header}>{header}</th>
                            ))
                        }
                        {
                            (enableAmount) &&
                            <th>{amount}</th>
                        }
                        {
                            (enableDelete) &&
                            <th className='text-center'>Acciones</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((line, index) => (
                            <tr key={index}>
                                {
                                    keys.map((key, indexKey) => {
                                        const cellId = `cell-${index}-${indexKey}`;
                                        return (
                                            <td key={cellId} className="hover-cell" id={cellId}>
                                                {typeof (line[key]) === 'number' ? `${line[key]}` : `${line[key]?.slice(0, 14)}...`}
                                                <UncontrolledTooltip target={cellId} >
                                                    {line[key]}
                                                </UncontrolledTooltip>
                                            </td>
                                        );
                                    })
                                }
                                {
                                    (enableAmount) &&
                                    <td  >
                                        {
                                            (enableAmount && line.tipo?.cuantificable === 'true') ?
                                                (
                                                    <div className='col-md-4' >
                                                        <input
                                                            className="form-control text-center "
                                                            type="number"
                                                            id="checkInDate"
                                                            value={line?.extra !== undefined ? line?.extra : 1}
                                                            onChange={(e) => { onUpdateAmount(e.target.value, line) }}
                                                            min="0"
                                                        />
                                                    </div>
                                                ) : (<span>Servicio no es cuantificable.</span>)
                                        }
                                    </td>
                                }
                                {
                                    (enableEdit || enableDelete) &&
                                    <td className="d-flex justify-content-center">
                                        {
                                            enableEdit && <ButtonIconTable icon='mdi mdi-pencil' color='warning' onClick={() => onEdit(line)} />
                                        }
                                        {
                                            enableDelete && <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onDelete(line) }} />
                                        }
                                    </td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TabeListService