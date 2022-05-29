import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/parkT/">Home</Link>
        </li>
        <li>
          <Link to="/parkT/parkings">Rechercher un parking</Link>
        </li>
        <li>
          <Link to="/parkT/register-parking">Enregistrez votre parking</Link>
        </li>
        <li>
          <Link to="/parkT/admin-parking">Administrez votre parking</Link>
        </li>
        <li>
          <Link to="/parkT/handle-booked-parking">Gérez votre réservation</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
