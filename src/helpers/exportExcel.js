import * as XLSX from 'xlsx';
import { calculateStockMovements, getFecha, simbolosMoneda, getFechaTZ } from './helpers';

export const convertDataStockExcel = (allData) => {
    let data = [['Nombre', 'País', 'Existencias']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let row = [value.materia_prima.nombre, value.materia_prima.pais, calculateStockMovements(value.movimientos) + ' ' + value.materia_prima.unidad]

        data.push(row);
    }
    return data;
}

export const convertDataPurchaseOrdersExcel = (allData) => {
    let data = [['Fecha de pedido', 'Proveedor', 'Estado de pedido', 'Comprobante', 'Subtotal', 'Impuestos', 'Total']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let row = [getFecha(value.fechaPedido), value.proveedor.empresa, value.estadoPedido, value.numeroComprobante | '', value.subtotal, value.impuestosMonto, value.total]

        data.push(row);
    }
    return data;
}

export const convertDataProductReceptionExcel = (allData) => {
    let data = [['Fecha de pedido', 'Proveedor', 'Estado de pedido', 'Total', 'Estado de recepción', 'Fecha de recepción']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let row = [getFecha(value.fechaPedido), value.proveedor.empresa, value.pedido.estadoPedido, `₡${value.total}`, value.estadoRecepcion, value.fechaEntrega ? getFecha(value.fechaEntrega) : '']

        data.push(row);
    }
    return data;
}

export const convertDataCleaningJobsExcel = (allData) => {
    let data = [['Nombre', 'Código', 'Ubicación', 'Áreas']];
    for (let i = 0; i < allData.length; i++) {
        const puestoLimpieza = allData[i];

        let areasObj = []
        puestoLimpieza.areas.forEach(area => {
            areasObj.push(area.nombre)
        });
        const areas = areasObj.length > 0 ? areasObj.join(', ') : ''

        let row = [puestoLimpieza.nombre, puestoLimpieza.codigo, puestoLimpieza.ubicacion.nombre, areas]

        data.push(row);
    }
    return data;
}

export const convertDataCleanlinessCheck = (allData) => {
    let data = [['Fecha de chequeo', 'Puesto de limpieza', 'Revisado', 'Usuario', 'Áreas']];
    for (let i = 0; i < allData.length; i++) {
        const check = allData[i];
        console.log(check);
        let areasObj = []
        check.areas.forEach(area => {
            areasObj.push(`${area.area} ${area.estado ? '(Limpiado)' : '(Sin limpiar)'}`)
        });
        const areas = areasObj.length > 0 ? areasObj.join(', ') : ''
        console.log(areas);
        let row = [getFecha(check.fecha), check.puesto_limpieza.nombre, check.aprobado ? 'Sí' : 'No', check.usuario?.nombre || '', areas]

        data.push(row);
    }
    return data;
}


export const convertDataInternTransfers = (allData) => {
    let data = [['Fecha de transferencia', 'Desde', 'Hasta', 'Usuario']];
    for (let i = 0; i < allData.length; i++) {
        const internTransfer = allData[i];

        let row = [getFecha(internTransfer.fecha), internTransfer.almacenDesde?.nombre || '', internTransfer.almacenHasta?.nombre || '', internTransfer.usuario?.nombre || '']

        data.push(row);
    }
    return data;
}

export const convertirDataStockMoveExcel = (allData, nombre) => {
    let data = [['Producto', nombre, '', 'Existencias', calculateStockMovements(allData)], [], ['Movimientos'], [], ['Tipo', 'Lote', 'Código', 'Obtenido de', 'Fabricación', 'Vencimiento', 'Cantidad', 'Existencias', 'Precio unidad', 'Total', 'Registrado por', 'Fecha de registro']];
    for (let i = 0; i < allData.length; i++) {
        const movimiento = allData[i];

        const tipo = movimiento.tipo
        const lote = movimiento.lote
        const codigo = movimiento.codigo
        let obtenidoDe = ''
        if (movimiento.cedido === null || movimiento.cedido === false) {
            obtenidoDe = movimiento.proveedor ? movimiento.proveedor.empresa : "No especificado"
        } else {
            obtenidoDe = movimiento.cliente ? movimiento.cliente.nombre : "No especificado"
        }
        const fechaFabricacion = movimiento.fechaFabricacion ? getFecha(movimiento.fechaFabricacion) : ''
        const fechaVencimiento = movimiento.fechaVencimiento ? getFecha(movimiento.fechaVencimiento) : ''
        const cantidad = movimiento.cantidad
        const existencias = movimiento.tipo === 'ENTRADA' ? movimiento.existencia : ''
        const precioUnidad = movimiento.tipo === 'ENTRADA' ? `${simbolosMoneda[movimiento.moneda]}${movimiento.precio_unidad}` : ''
        const precioTotal = movimiento.tipo === 'ENTRADA' ? `${simbolosMoneda[movimiento.moneda]}${movimiento.precio}` : ''
        const usuario = movimiento.usuario?.nombre || ''
        const fechaRegistro = getFecha(movimiento.fecha)

        let row = [tipo, lote, codigo, obtenidoDe, fechaFabricacion, fechaVencimiento, cantidad, existencias, precioUnidad, precioTotal, usuario, fechaRegistro]

        data.push(row);
    }
    return data;
}

export const convertirDataUsuariosExcel = (allData) => {
    let data = [['Identificación', 'Nombre', 'Roles', 'Correos', 'Teléfonos']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let correos = ''
        if (value.correos) {
            for (let j = 0; j < value.correos.length; j++) {
                const c = value.correos[j];
                correos += `${c.email}${j < value.correos.length - 1 ? ', ' : ''}`
            }
        }

        let telefonos = ''
        if (value.telefonos) {
            for (let j = 0; j < value.telefonos.length; j++) {
                const c = value.telefonos[j];
                telefonos += `${c.telefono}${j < value.telefonos.length - 1 ? ', ' : ''}`
            }
        }

        let roles = ''
        for (let j = 0; j < value.roles.length; j++) {
            const c = value.roles[j];
            roles += `${c.nombre}${j < value.roles.length - 1 ? ', ' : ''}`
        }

        let row = [value.cedula, value.nombre, roles, correos, telefonos]

        data.push(row);
    }
    return data;
}

export const convertDataMenuExcel = (allData) => {
    let data = [['Tipo', 'Nombre', 'Descripción', 'Precio costo', 'Precio venta']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let row = [value.tipo, value.nombre, value.descripcion, value.precioCosto, value.precioVenta]

        data.push(row);
    }
    return data;
}

export const convertDataTaxesExcel = (allData) => {
    let data = [['Nombre', 'Valor']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let row = [value.nombre, `${value.valor}%`]

        data.push(row);
    }
    return data;
}

export const convertDataWarehouseExcel = (allData) => {
    let data = [['Nombre', 'Descripción']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let row = [value.nombre, value.descripcion]

        data.push(row);
    }
    return data;
}

export const convertDataCustomersExcel = (allData) => {
    let data = [['Tipo', 'Identificación', 'Nombre', 'País', 'Estado/Provincia', 'Ciudad', 'Calle', 'Código Postal', 'Dirección/Señas', 'Correos', 'Teléfonos', 'Redes']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let correos = ''
        if (value.correos) {
            for (let j = 0; j < value.correos.length; j++) {
                const c = value.correos[j];
                correos += `${c.email}${j < value.correos.length - 1 ? ', ' : ''}`
            }
        }

        let telefonos = ''
        if (value.telefonos) {
            for (let j = 0; j < value.telefonos.length; j++) {
                const c = value.telefonos[j];
                telefonos += `${c.telefono}${j < value.telefonos.length - 1 ? ', ' : ''}`
            }
        }

        let redes = ''
        if (value.redes) {
            for (let j = 0; j < value.redes.length; j++) {
                const c = value.redes[j];
                redes += `${c.red + ':' + c.enlace}${j < value.redes.length - 1 ? ', ' : ''}`
            }
        }


        let row = [value.tipo, value.codigo, value.nombre, value.pais, value.ciudad, value.city ? value.city : '', value.calle ? value.calle : '', value.cp ? value.cp : '', value.direccion ? value.direccion : '', correos, telefonos, redes]

        data.push(row);
    }
    return data;
}

export const convertDataSuppliersExcel = (allData) => {

    let data = [['Identificación', 'Nombre', 'Proveedurías', 'País', 'Estado/Provincia', 'Ciudad', 'Calle', 'Código Postal', 'Dirección/Señas', 'Correos', 'Teléfonos', 'Redes']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];

        let correos = ''
        if (value.correos) {
            for (let j = 0; j < value.correos.length; j++) {
                const c = value.correos[j];
                correos += `${c.email}${j < value.correos.length - 1 ? ', ' : ''}`
            }
        }

        let telefonos = ''
        if (value.telefonos) {
            for (let j = 0; j < value.telefonos.length; j++) {
                const c = value.telefonos[j];
                telefonos += `${c.telefono}${j < value.telefonos.length - 1 ? ', ' : ''}`
            }
        }

        let redes = ''
        if (value.redes) {
            for (let j = 0; j < value.redes.length; j++) {
                const c = value.redes[j];
                redes += `${c.red + ':' + c.enlace}${j < value.redes.length - 1 ? ', ' : ''}`
            }
        }

        let tipoProveedurias = ''
        if (value.provedurias) {
            for (let j = 0; j < value.provedurias.length; j++) {
                const c = value.provedurias[j];
                tipoProveedurias += `${c.tipo}${j < value.provedurias.length - 1 ? ', ' : ''}`
            }
        }


        let row = [value.cedula, value.empresa, tipoProveedurias, value.pais, value.ciudad, value.city ? value.city : '', value.calle ? value.calle : '', value.cp ? value.cp : '', value.direccion ? value.direccion : '', correos, telefonos, redes]

        data.push(row);
    }
    return data;
}


export const convertirDataRegistrosContablesExcel = (allData) => {
    let data = [['ID', 'Tipo cuenta', 'Fecha de registro', 'Monto', 'Tipo pago']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        const fechaRegistro = getFechaaa(value.fecha)
        let row = [i, value.tipoRegistroContable, fechaRegistro, value.monto, value.tipoPago ? value.tipoPago : 'PENDIENTE']

        data.push(row);
    }
    return data;
}

export const convertirDataRolesExcel = (allData) => {
    let data = [['ID', 'Nombre']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        let row = [i, value.nombre]

        data.push(row);
    }
    return data;
}

export const convertirDataTipoProveeduriaExcel = (allData) => {
    let data = [['ID', 'Nombre']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        let row = [i, value.nombre]

        data.push(row);
    }
    return data;
}

export const convertirDataUbicacionesExcel = (allData) => {

    let data = [['ID', 'Nombre']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        let row = [i, value.nombre]

        data.push(row);
    }

    return data;

}

export const convertirDataActivosExcel = (allData) => {
    let data = [['ID', 'Nombre', 'Referencia interna', 'Unidad', 'Fecha de registro']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        let row = [i, value.nombre, value.referenciaInterna, value.unidad, getFecha(value.fechaRegistro)]

        data.push(row);
    }
    return data;
}

export const convertirDataMovimientosActivosExcel = (allData) => {
    let data = [['ID', 'Tipo', 'Identificador', 'Beneficiario', 'Fecha', 'Activo', 'Referencia interna']];
    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        let row = [i, value.tipo, value.consecutivo.consecutivo, value.beneficiario, getFechaTZ('fechaHora', value.fecha), value.activo.nombre, value.activo.referenciaInterna]

        data.push(row);
    }
    return data;
}

export const exportAndDownloadExcel = (name, dataToExport) => {
    const ws = XLSX.utils.aoa_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    let archive = `${name}_${new Date().toLocaleDateString()}`;
    archive = archive.replaceAll('/', '-');
    XLSX.utils.book_append_sheet(wb, ws, archive);
    XLSX.writeFile(wb, `${archive}.xlsx`);
}


const getFechaaa = (fecha) => {
    var date = new Date(fecha);
    var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
    var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    return date.getFullYear() + '/' + mes + '/' + day;
}