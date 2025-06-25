import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService, tweetService } from '../services/api';

const RightSidebar = () => {
  const [stats, setStats] = useState({
    totalTweets: 0,
    totalUsers: 0,
    totalLikes: 0,
    totalRetweets: 0
  });
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, tweetsResponse] = await Promise.all([
        userService.getAllUsers(),
        tweetService.getAllTweets()
      ]);

      const users = usersResponse.data;
      const tweets = tweetsResponse.data;

      // Calculate stats
      const totalLikes = tweets.reduce((sum, tweet) => sum + tweet.likes, 0);
      const totalRetweets = tweets.reduce((sum, tweet) => sum + tweet.retweets, 0);

      setStats({
        totalTweets: tweets.length,
        totalUsers: users.length,
        totalLikes,
        totalRetweets
      });

      // Sort users by followers and take top 3
      const sortedUsers = users
        .sort((a, b) => b.followers - a.followers)
        .slice(0, 3);
      
      setTopUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="right-sidebar">
        <div className="sidebar-widget">
          <div className="loading">Loading stats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="right-sidebar">
      {/* Stats Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Platform Stats</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalTweets}</div>
            <div className="stat-label">Tweets</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalLikes}</div>
            <div className="stat-label">Likes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalRetweets}</div>
            <div className="stat-label">Retweets</div>
          </div>
        </div>
      </div>

      {/* Top Users Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Top Users</h3>
        <div className="top-users-list">
          {topUsers.map((user, index) => (
            <Link 
              key={user.id} 
              to={`/profile/${user.id}`} 
              className="top-user-item"
            >
              <div className="user-rank">#{index + 1}</div>
              <img src={user.avatar} alt={user.name} className="user-avatar-small" />
              <div className="user-info-small">
                <div className="user-name-small">{user.name}</div>
                <div className="user-followers-small">{user.followers} followers</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Features</h3>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span className="feature-text">Create & Edit Tweets</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👤</span>
            <span className="feature-text">User Management</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🖼️</span>
            <span className="feature-text">Unsplash Images</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span className="feature-text">Real-time Updates</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span className="feature-text">Responsive Design</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Widget */}
      <div className="sidebar-widget">
        <h3 className="widget-title">Quick Actions</h3>
        <div className="quick-actions">
          <Link to="/create-tweet" className="btn btn-primary btn-full btn-small">
            <span>✏️</span> New Tweet
          </Link>
          <Link to="/users" className="btn btn-secondary btn-full btn-small">
            <span>👥</span> Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
