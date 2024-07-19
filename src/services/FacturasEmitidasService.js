import { gql } from '@apollo/client';

export const OBTENER_FACTURAS_EMITIDAS = gql`
    query obtenerFacturasEmitidas {
        obtenerFacturasEmitidas {
            id
            result
            response {
                Id
                Cliente
                NumeroConsecutivo
                Clave
                CodigoRespuesta
                Mensaje
                Fecha
            }
            data {
                CodigoCliente
                DocElectronicos {
                    Encabezado {
                        TipoDocumento
                        SecuenciaControlada
                        NumeroConsecutivo
                        Clave
                        SecuenciaDocumento
                        Sucursal
                        Terminal
                        SituacionEnvio
                        CodigoActividad
                        CantDeci
                        FechaEmision
                        Receptor {
                            Nombre
                            IdentificacionTipo
                            IdentificacionNumero
                            NombreComercial
                            CorreoElectronico
                            CorreoElectronicoCC
                            FaxArea
                            FaxNumero
                        }
                        CondicionVenta
                        PlazoCredito
                        MedioPago
                        TipoCambio
                        CodigoMoneda
                    }
                    LineasDetalle {
                        EsServicio
                        CodigoCabys
                        CodigoTipo
                        Codigo
                        PartidaArancelaria
                        Cantidad
                        UnidadMedida
                        UnidadMedidaComercial
                        Detalle
                        PrecioUnitario
                        DescripcionExtra
                        Descuento
                        DetalleDescuento
                        Descuentos
                        BaseImponible
                        Impuestos {
                            Codigo
                            CodigoTarifa
                            Tarifa
                            FactorIVA
                            MontoExportacion
                            Exoneracion
                        }
                    }
                    InformacionReferencia
                }
            }
        }
    }
`;
