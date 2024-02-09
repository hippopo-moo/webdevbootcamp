const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas');


const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(detail => detail.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds});
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.Campground) throw new ExpressError('不正なキャンプ場データです。' , 400)
    const newCampground = await new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    console.log(campground);
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds/`);
}))

module.exports = router
