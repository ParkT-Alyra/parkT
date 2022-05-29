import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../Navbar";

function Layout(props) {
    const { accounts } = props;
    return (
    <>
      <Navbar accounts />
      <Outlet />
    </>
  );
}

export default Layout;