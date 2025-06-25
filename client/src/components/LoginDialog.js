import React, { useState } from 'react';
import './LoginDialog.css';

const DEMO_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
];

const LoginDialog = ({ open, onLogin, error }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShake(false);
    try {
      await onLogin(form);
    } catch {
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  const autofill = (user) => {
    setForm({ username: user.username, password: user.password });
  };

  return (
    <div className="login-dialog-backdrop">
      <div className={`login-dialog${shake ? ' shake' : ''}`}> 
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-group">
              <span className="material-icons input-icon">person</span>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-group">
              <span className="material-icons input-icon">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label="Show password"
              >
                <span className="material-icons">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="material-icons spinner">autorenew</span> : 'Login'}
          </button>
        </form>
        <div className="demo-users">
          <h4>Demo Users</h4>
          <table>
            <thead><tr><th>Username</th><th>Password</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {DEMO_USERS.map(u => (
                <tr key={u.username}>
                  <td>{u.username}</td>
                  <td>{u.password}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="autofill-btn" onClick={() => autofill(u)} title="Autofill">
                      <span className="material-icons">input</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
