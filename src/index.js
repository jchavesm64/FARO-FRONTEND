import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./i18n";

import { configureStore } from "./store/store";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.REACT_APP_URLSERVER, 
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Provider store={configureStore({})}>
        <React.Fragment>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.Fragment>
      </Provider>
    </ApolloProvider>
  </StrictMode>
);

reportWebVitals();
// serviceWorker.unregister();
