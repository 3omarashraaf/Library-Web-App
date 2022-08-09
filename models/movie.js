const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true 
    } ,
    language: {
        type: String,
        required: true 
    } ,
    posterUrl: {
        type: String,
        required: true 
    } ,
    homepage: {
        type: String 
    } ,
    id: {
        type: String,
        required: true,
        unique: true
    } ,
    imdbID: {
        type: String,
        required: true,
        unique: true
    } ,
    overview: {
        type: String,
        required: true 
    } ,
    releaseDate: {
        type: String,
        required: true 
    },
    trailerUrl: {
        type: String,
        required: true 
    },
    voteAvg: {
        type: Number,
        required: true 
    },
    voteCount: {
        type: Number,
        required: true 
    },
    genres: [
        {
            type: String,
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});
MovieSchema.post('findOneAndDelete',async(doc)=>{
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Movie', MovieSchema);