import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./i18n";

import { configureStore } from "./store/store";

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', //local database
  //uri: process.env.REACT_APP_DATABASEURI, //production database
  cache: new InMemoryCache({
    addTypename: false
  }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <Provider store={configureStore({})}>
      <React.Fragment>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  </ApolloProvider>,
);

reportWebVitals();
// serviceWorker.unregister();

