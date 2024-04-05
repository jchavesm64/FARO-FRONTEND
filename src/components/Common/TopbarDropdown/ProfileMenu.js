import React, { useState, useEffect } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";


import { Link, useNavigate } from "react-router-dom";
import withRouter from "../withRouter";


const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState(localStorage.getItem("nombre"));

  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  const onClickLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("roles");
    localStorage.removeItem("cedula");
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="d-none d-xl-inline-block ms-2 me-2">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/profile">
            <DropdownItem>
              <i className="ri-user-line align-middle me-2" />
              Perfil
            </DropdownItem>
          </Link>
          <div className="dropdown-divider" />
          <DropdownItem onClick={() => onClickLogOut()}>
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            <span>Salir</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};


export default withRouter(
  ProfileMenu
);
