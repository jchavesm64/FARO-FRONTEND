import React, { useEffect, useState } from "react";

const TrPermission = ({ permission, onHandlePermission }) => {
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [deleteR, setDeleteR] = useState(false)
    const [see, setSee] = useState(false)
    const [allSelected, setAllSelected] = useState(false)

    useEffect(() => {
        setAdd(permission.agregar)
        setEdit(permission.editar)
        setDeleteR(permission.eliminar)
        setSee(permission.ver)
        if (permission.agregar && permission.editar && permission.eliminar && permission.ver) {
            setAllSelected(true)
        }
    }, [permission])

    useEffect(() => {
        if (add && edit && deleteR && see) {
            setAllSelected(true)
        } else {
            setAllSelected(false)
        }
    }, [add, edit, deleteR, see])

    const onHandleValue = (mode) => {
        if (mode === 'add') {
            setAdd(!add)
            onHandlePermission('add', permission.modulo, !add)
            return
        }
        if (mode === 'edit') {
            setEdit(!edit)
            onHandlePermission('edit', permission.modulo, !edit)
            return
        }
        if (mode === 'delete') {
            setDeleteR(!deleteR)
            onHandlePermission('delete', permission.modulo, !deleteR)
            return
        }
        if (mode === 'see') {
            setSee(!see)
            onHandlePermission('see', permission.modulo, !see)
            return
        }
        if (mode === 'all') {
            setAdd(true)
            setEdit(true)
            setDeleteR(true)
            setSee(true)
            onHandlePermission('all', permission.modulo, true)
            return
        }
        if (mode === 'none') {
            setAdd(false)
            setEdit(false)
            setDeleteR(false)
            setSee(false)
            onHandlePermission('none', permission.modulo, false)
            return
        }
    }


    return (
        <tr>
            <td>{permission.modulo}</td>
            <td style={{ display: 'flex', alignItems: 'center' }}>
                <div className="me-5">
                    <input className="form-check-input me-2" type="checkbox" checked={edit} onClick={(e) => { onHandleValue('edit') }} />
                    <span>editar</span>
                </div>
                <div className="me-5">
                    <input className="form-check-input me-2" type="checkbox" checked={deleteR} onClick={(e) => { onHandleValue('delete') }} />
                    <span>eliminar</span>
                </div>
                <div className="me-5">
                    <input className="form-check-input me-2" type="checkbox" checked={add} onClick={(e) => { onHandleValue('add') }} />
                    <span>agregar</span>
                </div>
                <div className="me-5">
                    <input className="form-check-input me-2" type="checkbox" checked={see} onClick={(e) => { onHandleValue('see') }} />
                    <span>ver</span>
                </div>
                <div className="me-5">
                    {!allSelected ?
                        <span className="pointer text-decoration-underline me-2" onClick={() => onHandleValue('all')}>
                            Todos
                        </span>
                        :
                        <span className="pointer text-decoration-underline me-2" onClick={() => onHandleValue('none')}>
                            Ninguno
                        </span>
                    }
                </div>
            </td>
        </tr>
    );
}



export default TrPermission;
