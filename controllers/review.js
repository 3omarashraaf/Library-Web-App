const Review = require('../models/review');
const Book = require('../models/book');
const review = require('../models/review');




module.exports.addReview = async(req,res)=>{
    const isbn = req.params.isbn
    const book = await Book.findOne({isbn})
    const review = new Review(req.body.review)
    review.user = req.session.user.user_id
    book.reviews.push(review)
    await review.save()
    await book.save()
    res.redirect(`/books/${isbn}`)
}
module.exports.deleteReview = async(req,res)=>{
    const {isbn, id} = req.params
    await Book.findOneAndUpdate({isbn},{$pull: {reviews: id}});
    await Review.findByIdAndDelete(id)
    res.redirect(`/books/${isbn}`)
}
