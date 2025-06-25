import React, { useState, useEffect } from 'react';


const TweetForm = ({ onTweetCreate, initialData = null, onCancel = null, currentUser = null }) => {
  const [formData, setFormData] = useState({
    userId: currentUser?.id || '',
    content: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId || currentUser?.id || '',
        content: initialData.content || '',
        image: initialData.image || ''
      });
    }
  }, [initialData, currentUser]);

  useEffect(() => {
    if (!initialData && currentUser) {
      setFormData(f => ({
        ...f,
        userId: currentUser.id
      }));
    }
  }, [currentUser, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.content.trim()) {
      setError('Please enter tweet content');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const tweetData = {
        userId: formData.userId,
        content: formData.content.trim(),
        image: formData.image.trim() || null
      };

      await onTweetCreate(tweetData);
      
      // Reset form if not editing
      if (!initialData) {
        setFormData({
          userId: currentUser?.id || '',
          content: '',
          image: ''
        });
      }
      
    } catch (error) {
      setError('Failed to create tweet. Please try again.');
      console.error('Error creating tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomUnsplashImage = () => {
    const categories = ['nature', 'technology', 'food', 'travel', 'abstract', 'people'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomId = Math.floor(Math.random() * 1000);
    return `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=300&fit=crop&q=80&random=${randomId}&sig=${randomCategory}`;
  };

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="tweet-form-container">
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="tweet-form">
        {/* Remove user select, show user info instead */}
        {currentUser && (
          <div className="form-group">
            <label>User:</label>
            <div>{currentUser.name} (@{currentUser.username})</div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="content">Tweet Content:</label>
          <textarea
            id="content"
            name="content"
            autoComplete="off"
            value={formData.content}
            onChange={handleInputChange}
            className="form-input form-textarea"
            placeholder="What's happening?"
            maxLength={280}
            required
          />
          <small className="character-count">
            {formData.content.length}/280 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL (optional):</label>
          <input
            type="url"
            id="image"
            name="image"
            autoComplete="off"
            value={formData.image}
            onChange={handleInputChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            id="add-random-image"
            name="add-random-image"
            onClick={() => setFormData(prev => ({ ...prev, image: getRandomUnsplashImage() }))}
            className="btn btn-secondary btn-small"
            style={{ marginTop: '0.5rem' }}
          >
            Add Random Image
          </button>
        </div>

        {formData.image && (
          <div className="form-group">
            <label>Image Preview:</label>
            <div className="image-preview">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="preview-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  setFormData(prev => ({ ...prev, image: '' }));
                  setError('Invalid image URL');
                }}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Posting...' : (initialData ? 'Update Tweet' : 'Post Tweet')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TweetForm;

// Replace emojis with Material Icons (Google Fonts)
// In your main HTML (public/index.html), add:
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
// Then use <span className="material-icons">icon_name</span> in place of emojis.
// Example replacements below:

// In your React components (e.g., TweetForm, TweetCard, Navbar, etc.), replace:
// 🚀  => <span className="material-icons" title="rocket">rocket_launch</span>
// 🏏  => <span className="material-icons" title="sports_cricket">sports_cricket</span>
// ✈️  => <span className="material-icons" title="flight">flight</span>
// ☕  => <span className="material-icons" title="coffee">coffee</span>
// 💡  => <span className="material-icons" title="lightbulb">lightbulb</span>
// 🤖  => <span className="material-icons" title="smart_toy">smart_toy</span>
// 📚  => <span className="material-icons" title="menu_book">menu_book</span>
// 💻  => <span className="material-icons" title="computer">computer</span>
// 🔥  => <span className="material-icons" title="whatshot">whatshot</span>
// 🏰  => <span className="material-icons" title="castle">castle</span>
// ✨  => <span className="material-icons" title="auto_awesome">auto_awesome</span>
// 🏏  => <span className="material-icons" title="sports_cricket">sports_cricket</span>
// ...and so on for other emojis.

// You can now update your JSX to use these icons instead of emojis for a modern, consistent look.
