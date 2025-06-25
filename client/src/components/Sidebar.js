import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
      description: 'View all tweets'
    },
    {
      path: '/create-tweet',
      icon: '✏️',
      label: 'Tweet',
      description: 'Create new tweet'
    },
    {
      path: '/users',
      icon: '👥',
      label: 'Users',
      description: 'Manage users'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <span className="logo-icon">🐦</span>
            <span className="logo-text">TwitterClone</span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          {navigationItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-icon">📝</span>
              <span>CRUD Operations</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔄</span>
              <span>Real-time Updates</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🖼️</span>
              <span>Unsplash Images</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
