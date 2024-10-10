import moment from 'moment-timezone';

export const calculateStockMovements = (datos) => {
    var cantidad = 0;
    datos.forEach(item => {
        if (item.tipo === 'ENTRADA') {
            cantidad += item.cantidad
        } else {
            cantidad -= item.cantidad;
        }
    })
    return cantidad;
}

export const getFechaTZ = (modo, fecha) => {
    if (fecha !== null && fecha.trim().length > 0 && modo !== null && modo.trim().length > 0) {
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

export const convertDate = (fechaStr) => {
    const currentYear = new Date().getFullYear();

    const formatter = new Intl.DateTimeFormat('es', { month: 'long' }); //'es' se cambia para manejar el idioma selecionado

    const regex = /(\d{1,2}) de (\w+)/;
    const match = fechaStr.match(regex);

    if (!match) {
        throw new Error('Formato de fecha inválido. Usa el formato "DD de MMMM".');
    }

    const [, day, monthName] = match;

    let monthIndex = -1;

    for (let i = 0; i < 12; i++) {
        const formattedMonth = formatter.formatToParts(new Date(currentYear, i)).find(part => part.type === 'month').value;
        if (formattedMonth.toLowerCase() === monthName.toLowerCase()) {
            monthIndex = i;
            break;
        }
    }

    if (monthIndex === -1) {
        throw new Error('Nombre del mes inválido.');
    }
    const date = new Date(currentYear, monthIndex, day);

    if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida.');
    }

    const monthFormatted = String(date.getMonth() + 1).padStart(2, '0');
    const dayFormatted = String(date.getDate()).padStart(2, '0');

    return `${currentYear}-${monthFormatted}-${dayFormatted}`;
};

export const timestampToDateLocal = (timestamp, format) => {
    const date = new Date(timestamp);

    const day = String(date.getUTCDate()).padStart(2, '0');  // Obtener el día y agregar ceros a la izquierda si es necesario
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Obtener el mes (de 0 a 11) y agregar 1
    const year = date.getUTCFullYear();

    if (format === 'label') {

        return `${day}/${month}/${year}`;
    }
    if (format === 'date') {
        return `${year}-${month}-${day}`;
    }
};