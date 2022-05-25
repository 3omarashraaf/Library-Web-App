const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {
        type: String,
        required: true 
    } ,
    imgUrl: {
        type: String,
        required: true 
    } ,
    isbn: {
        type: String,
        required: true 
    } ,
    description: {
        type: String,
        required: true 
    } ,
    author: {
        type: String,
        required: true 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});
BookSchema.post('findOneAndDelete',async(doc)=>{
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Book', BookSchema);