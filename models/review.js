const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    rating: {type: Number , required: true},
    text: {type: String , required: true}
})

module.exports = mongoose.model('Review',ReviewSchema)