const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ListSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    privacy:{
        type: String,
        required: true,
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    books:[{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    movies:[{
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }],
    tvshows:[{
        type: Schema.Types.ObjectId,
        ref: 'Tvshow'
    }],
    coverUrl:{
        type: String
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    ,
    description:{
        type: String
    }
})

module.exports = mongoose.model('List', ListSchema);