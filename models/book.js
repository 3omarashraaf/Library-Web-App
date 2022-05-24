const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    imgUrl: String,
    isbn: String,
    description: String,
    author: String
});

module.exports = mongoose.model('Book', BookSchema);