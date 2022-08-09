const {fetchMovies,fetchOneMovie} = require('../utils/fetchMovies');
const Movie = require('../models/movie');
const Review = require('../models/review');

module.exports.index = async(req,res) => {
    const movies = await Movie.find({})
    res.render('movies/index',{movies})
}
module.exports.createMovie = async(req,res) => {}
module.exports.showEditPage = async(req,res) => {}
module.exports.editMovie = async(req,res) => {}
module.exports.deleteMovie = async(req,res) => {}
module.exports.showOneMovie = async(req,res) => {
    const movie = await Movie.findOne({id: req.params.id}).populate({path:'reviews',populate:{path:'user'}})
    if(!movie){
        req.flash('error',`Sorry we don't have that movie`)
        res.redirect('/movies')
    }
    res.render('movies/show',{movie})
}
module.exports.search = async(req,res) => {
    const movies = await fetchMovies(req.query.searchKey)
    res.render('movies/searchResult',{movies})
}
module.exports.addReview = async(req,res)=>{
    const id = req.params.id
    const movie = await Movie.findOne({id})
    const review = new Review(req.body.review)
    review.user = req.session.user.user_id
    movie.reviews.push(review)
    await review.save()
    await movie.save()
    res.redirect(`/movies/${id}`)
}
module.exports.deleteReview = async(req,res)=>{
    const {id, reviwID} = req.params
    await Movie.findOneAndUpdate({id},{$pull: {reviews: reviwID}});
    await Review.findByIdAndDelete(reviwID)
    res.redirect(`/movies/${id}`)
}
