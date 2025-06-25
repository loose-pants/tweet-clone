import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import CreateTweet from './components/CreateTweet';
import EditTweet from './components/EditTweet';
import UserManagement from './components/UserManagement';
import ErrorBoundary from './components/ErrorBoundary';
import LoginDialog from './components/LoginDialog';
import { setAuth, removeAuth, getAuth } from './services/api';
import './styles.css';

function App() {
  const [loginOpen, setLoginOpen] = useState(!getAuth());
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async ({ username, password }) => {
    setAuth(username, password);
    // Try a protected request to check credentials
    try {
      // Try to fetch users (protected)
      await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Basic ${btoa(`${username}:${password}`)}` }
      });
      setUser({ username });
      setLoginOpen(false);
      setLoginError('');
    } catch (e) {
      removeAuth();
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    removeAuth();
    setUser(null);
    setLoginOpen(true);
  };

  return (
    <ErrorBoundary>
      <Router>
        <LoginDialog open={loginOpen} onLogin={handleLogin} error={loginError} />
        <div className="App">
          <Navbar user={user} onLogout={handleLogout} />
          <div className="app-layout">
            <Sidebar />
            <div className="main-content-with-sidebars">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-tweet" element={<CreateTweet currentUser={user} />} />
                <Route path="/edit-tweet/:id" element={<EditTweet currentUser={user} />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="/users" element={<UserManagement />} />
              </Routes>
            </div>
            <RightSidebar />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
