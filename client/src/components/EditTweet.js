import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tweetService } from '../services/api';
import TweetForm from './TweetForm';

const EditTweet = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        setLoading(true);
        const response = await tweetService.getTweetById(id);
        setInitialData(response.data);
      } catch (err) {
        setError('Failed to fetch tweet details');
      } finally {
        setLoading(false);
      }
    };
    fetchTweet();
  }, [id]);

  const handleUpdate = async (tweetData) => {
    await tweetService.updateTweet(id, tweetData);
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <TweetForm onTweetCreate={handleUpdate} initialData={initialData} currentUser={currentUser} />;
};

export default EditTweet;