import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      bio: '',
      avatar: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.createUser(formData);
      setUsers([...users, response.data]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateUser(currentUser.id, formData);
      setUsers(users.map(user => 
        user.id === currentUser.id ? response.data : user
      ));
      setShowEditModal(false);
      setCurrentUser(null);
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(currentUser.id);
      setUsers(users.filter(user => user.id !== currentUser.id));
      setShowDeleteModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const getRandomIndianAvatar = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="content-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>User Management</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          Create User
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.avatar} alt={user.name} className="avatar" />
            <h3>{user.name}</h3>
            <p className="username">@{user.username}</p>
            <p className="bio">{user.bio}</p>
            
            <div className="user-stats">
              <div className="stat">
                <div className="stat-number">{user.following}</div>
                <div className="stat-label">Following</div>
              </div>
              <div className="stat">
                <div className="stat-number">{user.followers}</div>
                <div className="stat-label">Followers</div>
              </div>
            </div>
            
            <div className="user-actions">
              <button 
                onClick={() => openEditModal(user)}
                className="btn btn-secondary btn-small"
              >
                Edit
              </button>
              <button 
                onClick={() => openDeleteModal(user)}
                className="btn btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New User</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio:</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Avatar URL:</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar: getRandomIndianAvatar() }))}
                  className="btn btn-secondary btn-small"
                  style={{ marginTop: '0.5rem' }}
                >
                  Random Avatar
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Bio:</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Avatar URL:</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar: getRandomIndianAvatar() }))}
                  className="btn btn-secondary btn-small"
                  style={{ marginTop: '0.5rem' }}
                >
                  Random Avatar
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete User</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <p>Are you sure you want to delete <strong>{currentUser.name}</strong>? This will also delete all their tweets.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
