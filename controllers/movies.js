const {fetchMovies,fetchOneMovie} = require('../utils/fetchMovies');
const Movie = require('../models/movie');

module.exports.index = async(req,res) => {
    const movies = await Movie.find({})
    res.render('movies/index',{movies})
}
module.exports.createMovie = async(req,res) => {}
module.exports.showEditPage = async(req,res) => {}
module.exports.editMovie = async(req,res) => {}
module.exports.deleteMovie = async(req,res) => {}
module.exports.showOneMovie = async(req,res) => {
    const movie = await fetchOneMovie(req.params.id)
    res.render('movies/show',{movie})
}
module.exports.search = async(req,res) => {
    const movies = await fetchMovies(req.query.searchKey)
    res.render('movies/searchResult',{movies})
}