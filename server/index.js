const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const tweetController = require('./controllers/tweetController');
const userController = require('./controllers/userController');
const tweetRoutes = require('./routes/tweetRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data with Indian names and Unsplash images
// Add password and role to each user for UAC
const users = [
  {
    id: '1',
    name: 'Priya Sharma',
    username: 'priya_sharma',
    password: 'priya123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Software Engineer | Love coding and chai ☕',
    following: 234,
    followers: 1876
  },
  {
    id: '2',
    name: 'Arjun Patel',
    username: 'arjun_patel',
    password: 'arjun123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Product Manager | Cricket enthusiast 🏏',
    following: 567,
    followers: 2345
  },
  {
    id: '3',
    name: 'Kavya Reddy',
    username: 'kavya_reddy',
    password: 'kavya123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Designer | Art lover | Traveler ✈️',
    following: 890,
    followers: 3421
  },
  {
    id: '4',
    name: 'Rohit Kumar',
    username: 'rohit_kumar',
    password: 'rohit123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Entrepreneur | Tech enthusiast | Coffee addict',
    following: 445,
    followers: 1987
  },
  {
    id: '5',
    name: 'Ananya Singh',
    username: 'ananya_singh',
    password: 'ananya123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Data Scientist | ML enthusiast | Bookworm 📚',
    following: 322,
    followers: 2789
  }
];

let tweets = [
  {
    id: '1',
    userId: '1',
    content: 'Just finished an amazing coding session! Building something exciting with React and Node.js 🚀 #coding #webdev',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    retweets: 8,
    replies: 5,
    userId: '2',
    content: 'What a match! India vs Australia was absolutely thrilling. That last over had me on the edge of my seat! 🏏🔥',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 156,
    retweets: 45,
    replies: 23,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&h=300&fit=crop'
  },
  {
    id: '3',
    userId: '3',
    content: 'Exploring the beautiful streets of Jaipur today. The architecture here is absolutely breathtaking! 🏰✨ #travel #jaipur',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 89,
    retweets: 22,
    replies: 11,
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0ad8b2f?w=500&h=300&fit=crop'
  },
  {
    id: '4',
    userId: '4',
    content: 'Just launched our new startup! Excited to revolutionize the way people connect and share ideas. The journey begins now! 💡🚀',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likes: 234,
    retweets: 67,
    replies: 34,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=300&fit=crop'
  },
  {
    id: '5',
    userId: '5',
    content: 'Working on some fascinating machine learning models today. The possibilities with AI are truly endless! 🤖📊 #machinelearning #ai',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    likes: 178,
    retweets: 55,
    replies: 18,
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=300&fit=crop'
  },
  {
    id: '6',
    userId: '1',
    content: 'Morning chai and code - the perfect combination to start any day! ☕💻 What\'s your favorite way to begin the morning?',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    likes: 67,
    retweets: 15,
    replies: 28,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop'
  }
];

// Helper function to get user by ID
const getUserById = (id) => users.find(user => user.id === id);

// Set initial data for controllers
userController.setData({ users });
tweetController.setData({ tweets, users });

// Remove global authentication middleware
// app.use(authenticate);

// Only protect sensitive tweet/user actions
app.use('/api/tweets', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return authenticate(req, res, next);
  }
  next();
});
app.use('/api/users', (req, res, next) => {
  // Only protect update/delete user
  if (['PUT', 'DELETE'].includes(req.method)) {
    return authenticate(req, res, next);
  }
  next();
});

// Use routes (example: only admin can delete tweets)
app.use('/api/tweets', tweetRoutes);
app.use('/api/users', userRoutes);

// Routes

// Get all tweets with user information
app.get('/api/tweets', (req, res) => {
  const tweetsWithUsers = tweets.map(tweet => ({
    ...tweet,
    user: getUserById(tweet.userId)
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(tweetsWithUsers);
});

// Create a new tweet
app.post('/api/tweets', (req, res) => {
  const { userId, content, image } = req.body;
  
  if (!userId || !content) {
    return res.status(400).json({ error: 'User ID and content are required' });
  }
  
  const newTweet = {
    id: uuidv4(),
    userId,
    content,
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
});

// Get a single tweet by ID
app.get('/api/tweets/:id', (req, res) => {
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
});

// Update a tweet (PUT)
app.put('/api/tweets/:id', (req, res) => {
  const tweetId = req.params.id;
  const { content, image } = req.body;
  const tweetIndex = tweets.findIndex(t => t.id === tweetId);
  
  if (tweetIndex === -1) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  tweets[tweetIndex] = {
    ...tweets[tweetIndex],
    content,
    image: image || tweets[tweetIndex].image,
    updatedAt: new Date()
  };
  
  const tweetWithUser = {
    ...tweets[tweetIndex],
    user: getUserById(tweets[tweetIndex].userId)
  };
  
  res.json(tweetWithUser);
});

// Delete a tweet
app.delete('/api/tweets/:id', (req, res) => {
  const tweetId = req.params.id;
  const tweetIndex = tweets.findIndex(t => t.id === tweetId);
  
  if (tweetIndex === -1) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  
  const deletedTweet = tweets.splice(tweetIndex, 1)[0];
  res.json({ message: 'Tweet deleted successfully', tweet: deletedTweet });
});

// Like/unlike a tweet
app.post('/api/tweets/:id/like', (req, res) => {
  const tweetId = req.params.id;
  const tweet = tweets.find(t => t.id === tweetId);
  
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  
  // For simplicity, we'll just increment likes
  tweet.likes += 1;
  
  const tweetWithUser = {
    ...tweet,
    user: getUserById(tweet.userId)
  };
  
  res.json(tweetWithUser);
});

// Retweet a tweet
app.post('/api/tweets/:id/retweet', (req, res) => {
  const tweetId = req.params.id;
  const tweet = tweets.find(t => t.id === tweetId);
  
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  
  tweet.retweets += 1;
  
  const tweetWithUser = {
    ...tweet,
    user: getUserById(tweet.userId)
  };
  
  res.json(tweetWithUser);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, username, bio, avatar } = req.body;
  
  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required' });
  }
  
  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    name,
    username,
    bio: bio || '',
    avatar: avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&random=${Date.now()}`,
    following: 0,
    followers: 0
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, username, bio, avatar } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required' });
  }
  
  // Check if username already exists (excluding current user)
  const existingUser = users.find(user => user.username === username && user.id !== userId);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name,
    username,
    bio: bio || users[userIndex].bio,
    avatar: avatar || users[userIndex].avatar
  };
  
  res.json(users[userIndex]);
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Also delete all tweets by this user
  tweets = tweets.filter(tweet => tweet.userId !== userId);
  
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ message: 'User deleted successfully', user: deletedUser });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
