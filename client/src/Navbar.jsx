import React from "react";
import { Link } from "react-router-dom";
import logo from './logo_parkT.png' // relative path to image

function Navbar(props) {
  const { accounts, accountBalance } = props;
  return (
    <nav className="navbar is-warning" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/parkT/">
          <img src={logo} width="112" height="28"/>
        </Link>
      </div>
      <div className="navbar-menu ml-1">
        <div className="navbar-start">
          <a className="navbar-item">
            <Link to="/parkT/parkings">Rechercher un parking</Link>
          </a>
          <a className="navbar-item">
            <Link to="/parkT/register-parking">Enregistrez votre parking</Link>
          </a>
          <a className="navbar-item">
            <Link to="/parkT/admin-parking">Administrez votre parking</Link>
          </a>
          <a className="navbar-item">
            <Link to="/parkT/handle-booked-parking">Gérez votre réservation</Link>
          </a>
        </div>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">
          <a className="button is-black">
            <strong>{accounts[0]}</strong>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
