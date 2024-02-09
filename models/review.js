const mongoose = require('mongoose')
const {Schema} = mongoose

const reviewSchema = new Schema({
    rating: {
        type: String,
    },
    body: {
        type: String,
    },
})

module.exports = mongoose.model('Review', reviewSchema)
