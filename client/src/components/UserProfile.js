import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService, tweetService } from '../services/api';
import TweetCard from './TweetCard';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResponse, tweetsResponse] = await Promise.all([
        userService.getUserById(userId),
        tweetService.getAllTweets()
      ]);
      
      setUser(userResponse.data);
      // Filter tweets by this user
      const filteredTweets = tweetsResponse.data.filter(tweet => tweet.userId === userId);
      setUserTweets(filteredTweets);
      setError('');
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetUpdate = (updatedTweet) => {
    setUserTweets(userTweets.map(tweet => 
      tweet.id === updatedTweet.id ? updatedTweet : tweet
    ));
  };

  const handleTweetDelete = (deletedTweetId) => {
    setUserTweets(userTweets.filter(tweet => tweet.id !== deletedTweetId));
  };

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="content-section">
        <div className="error">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="content-section">
      {/* User Profile Header */}
      <div className="user-profile-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '1.5rem' }}
          />
          <div>
            <h1>{user.name}</h1>
            <p style={{ color: '#657786', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              @{user.username}
            </p>
            <p style={{ marginBottom: '1rem' }}>{user.bio}</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{user.following}</span>
                <span style={{ color: '#657786', marginLeft: '0.25rem' }}>Following</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>{user.followers}</span>
                <span style={{ color: '#657786', marginLeft: '0.25rem' }}>Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Tweets */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>Tweets ({userTweets.length})</h2>
        
        {userTweets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#657786' }}>
            <p>No tweets yet from this user.</p>
          </div>
        ) : (
          <div className="tweets-list">
            {userTweets.map(tweet => (
              <TweetCard 
                key={tweet.id} 
                tweet={tweet} 
                onUpdate={handleTweetUpdate}
                onDelete={handleTweetDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
