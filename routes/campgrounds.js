const express = require('express');
const router = express.Router();
const multer  = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { requireLogin, validateAuthor, validateCampground } = require('../middleware');
const campground = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');

router.route('/')
    .get(catchAsync(campground.index))
    .post(requireLogin, upload.array('image'), validateCampground,  catchAsync(campground.createCampground));

router.get('/new', requireLogin, campground.newCampground);

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(requireLogin, validateAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
    .delete(requireLogin, validateAuthor, catchAsync(campground.deleteCampground));

router.get('/:id/edit', requireLogin, validateAuthor, catchAsync(campground.editCampground));

module.exports = router;