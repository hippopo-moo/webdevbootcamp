const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const methodOverride = require('method-override')
const morgan = require('morgan');
const {campgroundSchema, reviewSchema} = require('./schemas');

// localhostだと何故か繋がらなくなったので、127.0.0.1に変更。無事繋がった。
mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！！');
        console.log(err);
    });

app.engine('ejs', ejsMate);
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(detail => detail.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(detail => detail.message).join(',')
        console.log(msg)
        throw new ExpressError(msg, 400)
    } else {
        console.log("next")
        next();
    }
}

app.get('/', (req, res) => {
    console.log(req.body);
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds});
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.Campground) throw new ExpressError('不正なキャンプ場データです。' , 400)
    const newCampground = await new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    console.log(campground);
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground});
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds/`);
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res)=> {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // req.flash('success', 'レビューを登録しました');
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req,res)=> {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

//全てのhttpメソッドにのあらゆるパスに対する処理
app.all('*', (req, res, next) => {
    next(new ExpressError('ページがみつかりませんでした！！', 404))
})

app.use((err, req, res, next)=>{
    const { statusCode = 500, message = 'エラー発生！'} = err
    if(!err.message) {
        err.message = '問題が起きました！'
    }
    res.status(statusCode).render('error', { err })
})

app.listen('3000', ()=> {
    console.log("ポート3000でリクエスト待受中");
});