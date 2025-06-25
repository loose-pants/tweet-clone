const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const { authenticate, authorize } = require('../middleware/auth');

// GET all tweets
router.get('/', tweetController.getAllTweets);
// POST create tweet (admin or user)
router.post('/', tweetController.createTweet);
// GET tweet by id
router.get('/:id', tweetController.getTweetById);
// PUT update tweet (admin or user)
router.put('/:id', authenticate, tweetController.updateTweet);
// DELETE tweet (admin only)
router.delete('/:id', authenticate, authorize(['admin']), tweetController.deleteTweet);

module.exports = router;
