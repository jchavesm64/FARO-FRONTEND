import React from "react";

const ButtonIconTable = (props) => {
  const { icon, ...rest } = props;
  return (
    <React.Fragment>
      <button
        type="button"
        className={`btn btn-rounded btn-${props.color} waves-effect waves-light me-3`}
        {...rest}
      >
        <i className={icon}></i>
      </button>
    </React.Fragment>
  );
};

export default ButtonIconTable;
