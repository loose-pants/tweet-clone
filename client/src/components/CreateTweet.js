import React from 'react';
import TweetForm from './TweetForm';
import { tweetService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateTweet = ({ currentUser }) => {
  const navigate = useNavigate();
  const handleCreate = async (tweetData) => {
    console.log('[CreateTweet] Submitting new tweet:', tweetData);
    try {
      const response = await tweetService.createTweet(tweetData);
      console.log('[CreateTweet] Tweet created successfully:', response.data);
      navigate('/');
      // Optionally force reload for demo:
      // window.location.reload();
    } catch (error) {
      console.error('[CreateTweet] Error creating tweet:', error);
    }
  };
  return <TweetForm onTweetCreate={handleCreate} currentUser={currentUser} />;
};

export default CreateTweet;
