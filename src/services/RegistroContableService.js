import { gql } from '@apollo/client';

export const OBTENER_REGISTROS_CONTABLES = gql`
    query obtenerRegistrosContables{
        obtenerRegistrosContables{
        id
        fechaRegistro
        fechaPago
        tipoPago
        tipoRegistroContable
        estado
        estadoRegistroContable
        referenciaID
        referenciaModelo
        referenciaNombre
        comprobantePago
        cliente{ 
            id
            nombre
        }
        proveedor{
            id
            empresa
        }
        usuario{
            id
            nombre
        }
        monto
        consecutivo{
            id
            consecutivo
        }
        
        }
    }
`;

export const OBTENER_REGISTROS_CONTABLES_TIPO = gql`
    query obtenerRegistrosContablesTipo($tipo:String){
        obtenerRegistrosContablesTipo(tipo:$tipo){
        id
        fechaRegistro
        fechaPago
        tipoPago
        tipoRegistroContable
        estado
        estadoRegistroContable
        referenciaID
        referenciaModelo
        referenciaNombre
        comprobantePago
        cliente{ 
            id
            nombre
        }
        proveedor{
            id
            empresa
        }
        usuario{
            id
            nombre
        }
        monto
        consecutivo{
            id
            consecutivo
        }
        
        }
    } 
`;

export const OBTENER_REGISTRO_CONTABLE = gql`
    query obtenerRegistroContable($id:ID){
        obtenerRegistroContable(id:$id){
        id
        fechaRegistro
        fechaPago
        tipoPago
        tipoRegistroContable
        estado
        estadoRegistroContable
        referenciaID
        referenciaModelo
        referenciaNombre
        comprobantePago
        cliente{ 
            id
            tipo
            nombre
            codigo
            pais
            ciudad
            city
            calle
            cp
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            redes{
                red
                enlace
            }
            estado
        }
        proveedor{
            id
            empresa
            cedula
            pais
            ciudad
            city
            calle
            cp
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            redes{
                red
                enlace
            }
        }
        usuario{
            id,
            nombre,
            cedula,
            correos{
                email
            },
            telefonos{
                telefono
            },
            estado
        }
        monto
        consecutivo{
            id
            consecutivo
        }
        
        }
    }
`;

export const GUARDAR_REGISTRO_CONTABLE = gql`
    mutation insertarRegistroContable($input:RegistroContableInput){
        insertarRegistroContable(input:$input){
            estado
            message
            data {
                id
            }
        }
    }
`;

export const ACTUALIZAR_REGISTRO_CONTABLE = gql`
    mutation actualizarRegistroContable($id:ID, $input:RegistroContableInput){
        actualizarRegistroContable(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DESACTIVAR_REGISTRO_CONTABLE = gql`
    mutation desactivarRegistroContable($id:ID){
        desactivarRegistroContable(id:$id){
            estado
            message
        }
    }
`;