const express = require('express');
const router = express.Router();

const { requireLogin, validateAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');

router.get('/',catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
router.get('/new', requireLogin, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', requireLogin, validateCampground, catchAsync(async (req, res, next) => {  
    const campground = new Campground(req.body.campground);
    campground.author = req.user.id;
    await campground.save();
    req.flash('success', 'You have successfully made a new campground!');
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path:'reviews',
        populate: {
            path: 'author'
        }}).populate('author');
    if(!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));
router.get('/:id/edit', requireLogin, validateAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', requireLogin, validateAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete('/:id', requireLogin, validateAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted');
    res.redirect('/campgrounds');
}));

module.exports = router;