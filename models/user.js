const mongoose = require('mongoose')
const Schema = mongoose.Schema
const List = require('./list')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    username: {
        type: String,
        required: [true, 'Username cannot be blank'],
        unique: true
    },
    email:{
        type: String,
        required: [true, 'Email cannot be blank'], 
        unique: true
    }, 
    // lists: [{title,[Books]},{title,[Books]}]
    password:{
        type: String,
        required: [true, 'Password cannot be blank'] 
    },
    about:{
        type: String
    },
    pfpUrl:{
        type:String,
        default: 'https://i.pinimg.com/474x/8f/1b/09/8f1b09269d8df868039a5f9db169a772.jpg'
    },
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'List'
    }]
})
UserSchema.post('findOneAndDelete',async(doc)=>{
    if (doc){
        await List.deleteMany({
            _id: {
                $in: doc.lists
            }
        })
    }
})

module.exports = mongoose.model('User',UserSchema)