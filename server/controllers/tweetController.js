// Handles all tweet-related logic
const { v4: uuidv4 } = require('uuid');

// In-memory data (to be replaced with DB/models in future)
let tweets = [];
let users = [];

const setData = (data) => {
  tweets = data.tweets;
  users = data.users;
};

const getUserById = (id) => users.find(user => user.id === id);

exports.getAllTweets = (req, res) => {
  const tweetsWithUsers = tweets.map(tweet => ({
    ...tweet,
    user: getUserById(tweet.userId)
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(tweetsWithUsers);
};

exports.createTweet = (req, res) => {
  const { userId, content, image } = req.body;
  if (!userId || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'User ID and non-empty content are required' });
  }
  const newTweet = {
    id: uuidv4(),
    userId,
    content: content.trim(),
    timestamp: new Date(),
    likes: 0,
    retweets: 0,
    replies: 0,
    image: image || null
  };
  tweets.unshift(newTweet);
  const tweetWithUser = {
    ...newTweet,
    user: getUserById(userId)
  };
  res.status(201).json(tweetWithUser);
};

exports.getTweetById = (req, res) => {
  const tweetId = req.params.id;
  const tweet = tweets.find(t => t.id === tweetId);
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  const tweetWithUser = {
    ...tweet,
    user: getUserById(tweet.userId)
  };
  res.json(tweetWithUser);
};

exports.updateTweet = (req, res) => {
  const tweetId = req.params.id;
  const { content, image } = req.body;
  const tweetIndex = tweets.findIndex(t => t.id === tweetId);
  if (tweetIndex === -1) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  tweets[tweetIndex].content = content;
  tweets[tweetIndex].image = image || null;
  res.json({ ...tweets[tweetIndex], user: getUserById(tweets[tweetIndex].userId) });
};

exports.deleteTweet = (req, res) => {
  const tweetId = req.params.id;
  const tweetIndex = tweets.findIndex(t => t.id === tweetId);
  if (tweetIndex === -1) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  tweets.splice(tweetIndex, 1);
  res.status(204).end();
};

exports.setData = setData;
