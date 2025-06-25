import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add: get/set/remove auth header helpers
export function setAuth(username, password) {
  const token = btoa(`${username}:${password}`);
  axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
  // Also set for the custom axios instance
  api.defaults.headers.common['Authorization'] = `Basic ${token}`;
}
export function removeAuth() {
  delete axios.defaults.headers.common['Authorization'];
  delete api.defaults.headers.common['Authorization'];
}
export function getAuth() {
  return axios.defaults.headers.common['Authorization'] || api.defaults.headers.common['Authorization'] || '';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tweet CRUD Operations
export const tweetService = {
  // READ - Get all tweets
  getAllTweets: () => api.get('/tweets'),
  
  // READ - Get single tweet
  getTweetById: (id) => api.get(`/tweets/${id}`),
  
  // CREATE - Create new tweet
  createTweet: (tweetData) => api.post('/tweets', tweetData),
  
  // UPDATE - Update tweet
  updateTweet: (id, tweetData) => api.put(`/tweets/${id}`, tweetData),
  
  // DELETE - Delete tweet
  deleteTweet: (id) => api.delete(`/tweets/${id}`),
  
  // Like tweet
  likeTweet: (id) => api.post(`/tweets/${id}/like`),
  
  // Retweet
  retweetTweet: (id) => api.post(`/tweets/${id}/retweet`),
};

// User CRUD Operations
export const userService = {
  // READ - Get all users
  getAllUsers: () => api.get('/users'),
  
  // READ - Get single user
  getUserById: (id) => api.get(`/users/${id}`),
  
  // CREATE - Create new user
  createUser: (userData) => api.post('/users', userData),
  
  // UPDATE - Update user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // DELETE - Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
};
