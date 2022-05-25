const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    rating: {type: Number , required: true},
    text: {type: String , required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Review',ReviewSchema)