const express = require('express');
const router = express.Router({ mergeParams: true });

const { requireLogin, validateReview, validateReviewAuthor } = require('../middleware')
const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviews')

router.post('/', requireLogin, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', requireLogin, validateReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;