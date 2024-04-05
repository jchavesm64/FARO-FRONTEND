import React, { useEffect, useState } from "react";

const TrInternTransferLine = ({linea, index, onHandleChange}) => {
    const [ value, setValue ] = useState(false)

    useEffect(() => {
      setValue(linea.cantidadTransferir)
    }, [linea])

    const onHandleValue = (i, newValue) => {
        if(newValue < 0 || newValue > linea.cantidad){
            setValue(value || 0)
            onHandleChange(i, value || 0)
        }else{
            setValue(newValue)
            onHandleChange(i, newValue)
        }
    }
    
    return (
        <tr>
            <td>{linea.producto.nombre}</td>
            <td>{`${linea.cantidad} ${linea.producto.unidad}`}</td>
            <td>
                <input type="number" className="form-control" value={value} onChange={(e)=>{onHandleValue(index, e.target.value)}} />
            </td>
        </tr>
    );
}



export default TrInternTransferLine;
