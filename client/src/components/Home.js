import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tweetService } from '../services/api';
import TweetCard from './TweetCard';
import SearchComponent from './SearchComponent';
import LoadingSpinner from './LoadingSpinner';
import TweetForm from './TweetForm';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTweetForm, setShowTweetForm] = useState(false);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const response = await tweetService.getAllTweets();
      setTweets(response.data);
      setFilteredTweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tweets');
      console.error('Error fetching tweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredTweets(tweets);
    } else {
      const filtered = tweets.filter(tweet => 
        tweet.content.toLowerCase().includes(term.toLowerCase()) ||
        tweet.user.name.toLowerCase().includes(term.toLowerCase()) ||
        tweet.user.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTweets(filtered);
    }
  };

  const handleTweetCreate = async (tweetData) => {
    try {
      const response = await tweetService.createTweet(tweetData);
      setTweets([response.data, ...tweets]);
      setShowTweetForm(false);
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  };

  const handleTweetUpdate = (updatedTweet) => {
    const updatedTweets = tweets.map(tweet => 
      tweet.id === updatedTweet.id ? updatedTweet : tweet
    );
    setTweets(updatedTweets);
    // Update filtered tweets as well
    handleSearch(searchTerm);
  };

  const handleTweetDelete = (deletedTweetId) => {
    const updatedTweets = tweets.filter(tweet => tweet.id !== deletedTweetId);
    setTweets(updatedTweets);
    setFilteredTweets(updatedTweets.filter(tweet => 
      !searchTerm || 
      tweet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tweet.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tweet.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="loading">Loading tweets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <div className="error">{error}</div>
        <button onClick={fetchTweets} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="content-section">
        <div className="page-header">
          <h1>Home Timeline</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setShowTweetForm(!showTweetForm)}
              className="btn btn-primary"
            >
              {showTweetForm ? 'Cancel' : 'Quick Tweet'}
            </button>
            <Link to="/create-tweet" className="btn btn-secondary">
              Full Editor
            </Link>
          </div>
        </div>

        {/* Search Component */}
        <SearchComponent 
          onSearch={handleSearch}
          placeholder="Search tweets, users..."
        />

        {/* Quick Tweet Form */}
        {showTweetForm && (
          <TweetForm 
            onTweetCreate={handleTweetCreate}
            onCancel={() => setShowTweetForm(false)}
          />
        )}
      </div>

      {/* Tweets List */}
      {filteredTweets.length === 0 ? (
        <div className="content-section">
          <div className="empty-state">
            {searchTerm ? (
              <>
                <h3>No tweets found</h3>
                <p>No tweets match your search for "{searchTerm}"</p>
                <button 
                  onClick={() => handleSearch('')}
                  className="btn btn-secondary"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <h3>No tweets yet</h3>
                <p>Be the first to share your thoughts with the world!</p>
                <Link to="/create-tweet" className="btn btn-primary">
                  Create First Tweet
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="tweets-list">
          {searchTerm && (
            <div className="search-results-header">
              <p>Showing {filteredTweets.length} tweet(s) for "{searchTerm}"</p>
            </div>
          )}
          {filteredTweets.map(tweet => (
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
  );
};

export default Home;
