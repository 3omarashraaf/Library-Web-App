const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const TvshowSchema = new Schema({
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
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    overview: {
        type: String,
        required: true 
    } ,
    releaseDate: {
        type: String,
        required: true 
    },
    numberOfSeasons: {
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
TvshowSchema.post('findOneAndDelete',async(doc)=>{
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Tvshow',TvshowSchema);