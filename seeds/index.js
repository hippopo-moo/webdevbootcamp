const mongoose = require('mongoose');
const Campground = require('../models/campground')
const { descriptors, places } = require('./seedHelper')
const cities = require('./cities')

// localhostだと何故か繋がらなくなったので、127.0.0.1に変更。無事繋がった。
mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！！');
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length)
        const price = Math.floor(Math.random() * 2000) + 1000
        const camp = new Campground(
            { title: `${sample(descriptors)}/${sample(places)}`,
             description: `誰が投げたかライフヴイが一つ組まれて、ほんとうにすきだ。米だってパシフィック辺のように見える銀杏の木に囲まれて青じろいとがったあごをしたはずがないんだみんなさがしてるんだろうああ、すぐみんな来た。たしかにあれは証明書か何かだったと思いながら答えました。そしてきゅうくつな上着の肩を気にしながら、この人たちを乗せてくださいと叫びました。猟をするか踊るかしてるんですよ青年は男の子の手をしっかりひいて立って、ジョバンニは、少し肩をすぼめてあいさつしました。`,
             location: `${cities[randomCityIndex].prefecture} ${cities[randomCityIndex].city}`,
             image: `https://images.unsplash.com/photo-1499560262498-a472b08d5f17`,
             price
            }
        )
        await camp.save()
    }
}
seedDB().then(()=> {
    mongoose.connection.close()
});
