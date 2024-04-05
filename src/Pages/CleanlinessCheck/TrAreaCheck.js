import React, { useEffect, useState } from "react";

const TrAreaCheck = ({area, index, check, onHandleCheckArea}) => {
    const [ value, setValue ] = useState(false)

    useEffect(() => {
      setValue(check)
    }, [check])

    const onHandleValue = (i, checked) => {
        setValue(!checked)
        onHandleCheckArea(i, !checked)
    }
    
    return (
        <tr>
            <td>{area.area}</td>
            <td>
                <input className="form-check-input" type="checkbox" value={value} checked={value} onClick={(e) => {onHandleValue(index, e.target.checked)}}/>
                {
                    check ? <span className="ms-2"> Limpia</span> : <span className="ms-2"> Sin Limpiar</span>
                }
            </td>
        </tr>
    );
}



export default TrAreaCheck;
