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

const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')

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
app.use(express.static(path.join(__dirname, 'public')))

// routeの設定
app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)

app.get('/', (req, res) => {
    console.log(req.body);
    res.render('home');
})

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
