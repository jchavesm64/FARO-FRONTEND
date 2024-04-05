import React from 'react';

import { Query } from '@apollo/client/react/components';
import { OBTENER_USUARIO_AUTENTICADO } from '../services/UsuarioService';

const Session = Component => props => (

    <Query query={OBTENER_USUARIO_AUTENTICADO} pollInterval={60000}>
        {({ loading, error, data, refetch }) => {
            if (loading) return <p>Cargando...</p>;
            if (error) return null;
            return <Component {...props} refetch={refetch} session={data} />
        }}
    </Query>
)

export default Session;