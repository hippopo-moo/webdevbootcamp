const mongoose = require('mongoose')
const Review = require('./review')
const {Schema} = mongoose

const campgroundSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//postを使っているので、コールバックの　functionには削除対象のオブジェクトが渡ってくる
campgroundSchema.post('findOneAndDelete', async function (doc){
    console.log(doc)
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)
