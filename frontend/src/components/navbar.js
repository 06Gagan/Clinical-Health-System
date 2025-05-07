import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = (props) => {
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode} mb-3`}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to={props.role === 'CRC' ? "/CRC" : "/PI"}>
          <strong>{props.title}</strong>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {props.role === 'CRC' ? (
              // Links for CRC users
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CRC">
                    Demographic Data
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Scheduling">
                    Schedule Trials
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/HealthData">
                    Record Health Data
                  </NavLink>
                </li>
              </>
            ) : (
              // Links for PI users
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/PI">
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/Logout">
                Logout
              </NavLink>
            </li>
          </ul>
          <div
            className={`form-check form-switch text-${
              props.mode === "light" ? "dark" : "light"
            }`}
          >
            <input
              className="form-check-input"
              type="checkbox"
              onClick={props.toggleMode}
              id="flexSwitchCheckDefault"
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              {`Enable ${props.mode === "light" ? "dark" : "light"} Mode`}
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;