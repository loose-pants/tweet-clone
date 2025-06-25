import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tweetService } from '../services/api';

const TweetCard = ({ tweet, onUpdate, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await tweetService.likeTweet(tweet.id);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error liking tweet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetweet = async () => {
    try {
      setIsLoading(true);
      const response = await tweetService.retweetTweet(tweet.id);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error retweeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await tweetService.deleteTweet(tweet.id);
      onDelete(tweet.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting tweet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="tweet-card">
        <div className="tweet-header">
          <img src={tweet.user.avatar} alt={tweet.user.name} className="avatar" />
          <div className="user-info">
            <h4>{tweet.user.name}</h4>
            <span>@{tweet.user.username} · {formatDate(tweet.timestamp)}</span>
          </div>
        </div>
        
        <div className="tweet-content">
          <p>{tweet.content}</p>
          {tweet.image && (
            <img src={tweet.image} alt="Tweet content" className="tweet-image" />
          )}
        </div>
        
        <div className="tweet-actions">
          <button 
            className="action-btn" 
            onClick={handleLike}
            disabled={isLoading}
          >
            ❤️ {tweet.likes}
          </button>
          
          <button 
            className="action-btn" 
            onClick={handleRetweet}
            disabled={isLoading}
          >
            🔄 {tweet.retweets}
          </button>
          
          <button className="action-btn">
            💬 {tweet.replies}
          </button>
          
          <Link 
            to={`/edit-tweet/${tweet.id}`} 
            className="action-btn"
            style={{ textDecoration: 'none' }}
          >
            ✏️ Edit
          </Link>
          
          <button 
            className="action-btn btn-danger" 
            onClick={() => setShowDeleteModal(true)}
            disabled={isLoading}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Tweet</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <p>Are you sure you want to delete this tweet? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Tweet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TweetCard;
