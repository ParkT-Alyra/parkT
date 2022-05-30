import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../Navbar";

function Layout(props) {
    const { account, balance } = props;
    return (
    <>
      <Navbar account={account} balance={balance} />
      <Outlet />
    </>
  );
}

export default Layout;