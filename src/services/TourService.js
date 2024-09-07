import { gql } from '@apollo/client';

export const OBTENER_TOURS = gql`
    query obtenerTours{
        obtenerTours{
            id
            tipo
            nombre
            precio
            estado
            descripcion
        }
    }
`;

export const OBTENER_TOUR = gql`
    query obtenerTour($id:ID){
        obtenerTour(id:$id){
            id
            tipo
            nombre
            precio
            estado
            descripcion
        }
    }
`;

export const SAVA_TOUR = gql`
    mutation insertarTour($input:TourInput){
        insertarTour(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TOUR = gql`
    mutation actualizarTour($id:ID, $input:TourInput){
        actualizarTour(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TOUR = gql`
    mutation desactivarTour($id:ID){
        desactivarTour(id:$id){
            estado
            message
        }
    }
`;