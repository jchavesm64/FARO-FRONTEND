import React, { useState } from 'react'
import ButtonIconTable from '../../../../../components/Common/ButtonIconTable';

const TabeListService = ({ data, headers, keys, enableDelete, actionDelete, enableAmount, actionAmount, mainKey, secondKey, type }) => {

    const onDelete = (element) => {
        if (!secondKey) {
            actionDelete(element[mainKey])
        } else {
            actionDelete(element[mainKey], element[secondKey])
        }

    };


    console.log(data);

    const onUpdateAmount = (amount, service) => {
        actionAmount(type, amount, service);
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
                            <th>Cantidad extra</th>
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
                                    keys.map((key, indexKey) => (
                                        <td key={`${index}-${key}`}>
                                            {line[key]}
                                        </td>
                                    ))
                                }
                                {
                                    (enableAmount) &&
                                    <td >
                                        {
                                            enableAmount &&
                                            <input
                                                className="form-control "
                                                type="number"
                                                id="checkInDate"
                                                value={line?.extra !== undefined ? line?.extra : 0}
                                                onChange={(e) => { onUpdateAmount(e.target.value, line) }}
                                                min="0"
                                            />
                                        }
                                    </td>
                                }
                                {
                                    (enableDelete) &&
                                    <td className="d-flex justify-content-center">

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