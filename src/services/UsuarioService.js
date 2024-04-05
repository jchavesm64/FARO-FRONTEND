import { gql } from '@apollo/client';

export const OBTENER_USUARIOS_ACTIVOS = gql`
    query obtenerUsuariosActivos{
        obtenerUsuariosActivos{
            id,
            nombre,
            cedula,
            correos{
                email
            },
            telefonos{
                telefono
            },
            roles{
                id
                nombre
                permisos{
                    modulo
                    agregar
                    editar
                    eliminar
                    ver
                }
                estado
            },
            estado
        }
    }
`;

export const OBTENER_USUARIO_AUTENTICADO = gql`
    query obtenerUsuarioAutenticado{
        obtenerUsuarioAutenticado{
            estado,
            data{
                id,
                nombre,
                cedula,
                correos{
                    email
                },
                telefonos{
                    telefono
                },
                roles{
                    id
                    nombre
                    permisos{
                        modulo
                        agregar
                        editar
                        eliminar
                        ver
                    }
                    estado
                },
                estado 
            }
        }
    }
`;

export const OBTENER_USUARIO = gql`
    query obtenerUsuario($id:ID){
        obtenerUsuario(id:$id){
            id,
            nombre,
            cedula,
            correos{
                email
            },
            telefonos{
                telefono
            },
            roles{
                id
                nombre
                permisos{
                    modulo
                    agregar
                    editar
                    eliminar
                    ver
                }
                estado
            },
            estado
        }
    }
`;

export const OBTENER_USUARIO_CODIGO = gql`
    query obtenerUsuarioByCodigo($codigo:String){
        obtenerUsuarioByCodigo(codigo:$codigo){
            id,
            nombre,
            cedula,
            correos{
                email
            },
            telefonos{
                telefono
            },
            roles{
                nombre
            },
            estado
        }
    }
`;

export const ENVIAR_CORREO = gql`
    mutation enviarCodigoVerificacion($codigo:String, $correo:String){
        enviarCodigoVerificacion(codigo:$codigo, correo:$correo){
            estado,
            codigo,
            message
        }
    }
`;

export const LOGIN = gql`
    mutation autenticarUsuario($cedula:String!, $clave:String!){
        autenticarUsuario(cedula:$cedula, clave:$clave){
            token,
            cedula,
            nombre,
            roles
        }
    }
`;

export const SAVE_USER = gql`
    mutation insertarUsuario($input:UsuarioInput){
        insertarUsuario(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_USER = gql`
    mutation actualizarUsuario($id:ID, $input:UsuarioInput){
        actualizarUsuario(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_USER = gql`
    mutation desactivarUsuario($id:ID){
        desactivarUsuario(id:$id){
            estado
            message
        }
    }
`;

export const RECUPERAR_CLAVE = gql`
    mutation recuperarClave($codigo:String, $nueva:String){
        recuperarClave(codigo:$codigo, nueva:$nueva){
            success
            message
        }
    }
`;

export const CAMBIAR_CLAVE = gql`
    mutation cambiarClave($id:ID, $actual:String, $nueva:String){
        cambiarClave(id:$id, actual:$actual, nueva:$nueva){
            success
            message
        }
    }
`;