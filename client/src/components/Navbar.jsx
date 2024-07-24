import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const userData = Cookies.get('userData');
  const role = userData ? JSON.parse(userData).role : null;

  //Logout user
  const handleLogout = () => {
    Cookies.remove('userData');
    Cookies.remove('jwt');
    setIsAuthenticated(false);
  };

  return (
    <div>

      <nav className="navbar navbar-expand-lg bg-body-tertiary navabar-light shadow">
        <div className="container">
          <NavLink className="navbar-brand fw-bolder fs-4  mx-auto" to="/"><img src="/assets/logo.png" height="80" alt="Multicare logo" /></NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="/">Home</NavLink>
              </li>
              {(!role || role === 'user') &&
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">About</NavLink>
                </li>
              }
              <li className="nav-item">
                <NavLink className="nav-link" to="/service">Services</NavLink>
              </li>
              {(!role || role === 'user') &&
                <li className="nav-item">
                  <NavLink className="nav-link" to="/contact">Contact</NavLink>
                </li>
              }
            </ul>
            {!isAuthenticated ?
              <>
                <NavLink to="/login" className="btn btn-outline-primary ms-auto px-4 rounded-pill">
                  <i className="fa fa-sign-in me-2"></i>Login</NavLink>
                <NavLink to="/register" className="btn btn-outline-primary ms-2 px-4 rounded-pill">
                  <i className="fa fa-user-plus me-2"></i>Register</NavLink>
              </>
              :
              <>
                <button className="btn btn-outline-primary ms-auto px-4 rounded-pill" onClick={handleLogout}><i className="fa fa-sign-in me-2"></i>Logout</button>
              </>
            }
          </div>
        </div>
      </nav>

    </div>
  );
}

export default Navbar;