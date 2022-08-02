const mongoose = require('mongoose')
require('dotenv').config();
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/bookshelf'
module.exports = () => {mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})};