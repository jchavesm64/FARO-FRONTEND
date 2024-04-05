import React from "react";
import { Navigate, Route } from "react-router-dom";


const AuthProtected = (props) => {
  if(!localStorage.getItem('token')){
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
    
  

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
