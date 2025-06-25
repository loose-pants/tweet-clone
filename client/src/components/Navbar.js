import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          🐦 TwitterClone
        </Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/create-tweet" 
              className={location.pathname === '/create-tweet' ? 'active' : ''}
            >
              Tweet
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className={location.pathname === '/users' ? 'active' : ''}
            >
              Users
            </Link>
          </li>
        </ul>
        <div className="navbar-user-actions">
          {user ? (
            <>
              <span className="navbar-user">{user.username}</span>
              <button className="btn btn-secondary btn-small" onClick={onLogout} style={{marginLeft: '1rem'}}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
