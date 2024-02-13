const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds});
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.Campground) throw new ExpressError('不正なキャンプ場データです。' , 400)
    const newCampground = await new Campground(req.body.campground)
    await newCampground.save()
    req.flash('success', '新しいキャンプ場の登録が成功しました！')
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'キャンプ場を更新しました');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'キャンプ場を削除しました');
    res.redirect(`/campgrounds/`);
}))

module.exports = router
