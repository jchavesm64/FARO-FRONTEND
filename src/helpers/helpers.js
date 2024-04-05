import moment from 'moment-timezone';

export const calculateStockMovements = (datos) => {
    var cantidad = 0;
    datos.map(item => {
        if (item.tipo === 'ENTRADA') {
            cantidad += item.cantidad
        } else {
            cantidad -= item.cantidad;
        }
    })
    return cantidad;
}

export const getFechaTZ = (modo, fecha) => {
    if (fecha !== null && fecha.trim().length > 0, modo !== null && modo.trim().length > 0) {
        switch (modo) {
            case 'fecha':
                return moment.tz(fecha, 'America/Costa_Rica').format('DD-MM-YYYY');
            case 'hora':
                return moment.tz(fecha, 'America/Costa_Rica').format('hh:mm a');
            case 'fechaHora':
                return moment.tz(fecha, 'America/Costa_Rica').format('DD-MM-YYYY hh:mm a');
            default:
                return moment.tz(fecha, 'America/Costa_Rica').format('DD-MM-YYYY');
        }
    }
    return '';
}


export const getFecha = (fecha) => {
    var date = new Date(fecha);
    var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
    var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    return date.getFullYear() + '/' + mes + '/' + day;
}

export const getFechaTable = (fechaString) => {
    if (fechaString !== null && fechaString.trim().length > 0) {
        const fecha = new Date(fechaString)

        return `${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}-${(fecha.getMonth() + 1) >= 10 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1)}-${fecha.getFullYear()}`
    }
    return ''
}

export const simbolosMoneda = {
    'US Dollar': '$',
    'Colón': '₡',
    'Yen': '¥'
}

export const tienePermisoSidebar = (roles, modulo) => {
    roles.forEach(rol => {
        rol.permisos.forEach(permiso => {
            if (permiso.modulo === modulo) {
                if (permiso.agregar || permiso.editar || permiso.eliminar) {
                    return true
                }
            }
        });
    });
    return false
}

export const tienePermisoAgregarModulo = (roles, modulo) => {
    roles.forEach(rol => {
        rol.permisos.forEach(permiso => {
            if (permiso.modulo === modulo) {
                if (permiso.agregar) {
                    return true
                }
            }
        });
    });
    return false
}

export const tienePermisoEditarModulo = (roles, modulo) => {
    roles.forEach(rol => {
        rol.permisos.forEach(permiso => {
            if (permiso.modulo === modulo) {
                if (permiso.editar) {
                    return true
                }
            }
        });
    });
    return false
}

export const tienePermisoEliminarModulo = (roles, modulo) => {
    roles.forEach(rol => {
        rol.permisos.forEach(permiso => {
            if (permiso.modulo === modulo) {
                if (permiso.eliminar) {
                    return true
                }
            }
        });
    });
    return false
}