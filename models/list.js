const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ListSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    books:[{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    coverUrl:{
        type: String,
        default: 'https://images.unsplash.com/photo-1528052332164-5d1c642a77f7?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770'
    },
    owner:{
        type: Schema.Types.ObjectId,
        required: true
    }
    ,
    description:{
        type: String
    }
})

module.exports = mongoose.model('List', ListSchema);