import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/parkings">Rechercher un parking</Link>
        </li>
        <li>
          <Link to="/register-parking">Enregistrer votre parking</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;