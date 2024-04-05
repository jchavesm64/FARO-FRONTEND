import React from "react";

const ButtonIconTable = (props) => {
  return (
    <React.Fragment>
        <button type="button" className={`btn btn-rounded btn-${props.color} waves-effect waves-light me-3`}  {...props}>
            <i className={props.icon}></i>
        </button>
    </React.Fragment>
  );
}



export default ButtonIconTable;
