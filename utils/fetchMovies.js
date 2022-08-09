const fetch = require('node-fetch');

module.exports.fetchMovies = async (searchKey) => {
    const query = new URLSearchParams({ query: searchKey }).toString()
    const url = (`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&${query}`)
    const response = await fetch(url) 
    .then(response => response.json());
    var movies = []
    if(response){
       if (response.total_results>0){ 
        for (movie of response.results) {    
                const newMovie = {
                    id: movie.id,
                    title: movie.original_title,
                    overview: movie.overview,
                    releaseDate: movie.release_date,
                    voteAvg: movie.vote_average,
                    voteCount: movie.vote_count,
                    poster: movie.poster_path
                }
                movies.push(newMovie)
            }
         }
    }
    return movies;
}


module.exports.fetchOneMovie = async (id) => {
    const movieUrl = (`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`)
    const response = await fetch(movieUrl) 
    .then(response => response.json());
    const videoUrl = (`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_KEY}&language=en-US`)
    const video = await fetch(videoUrl) 
    .then(video => video.json());
    const movie = {
        id: response.id,
        imdbID: response.imdb_id,
        title: response.original_title,
        language: response.original_language,
        posterUrl: `https://image.tmdb.org/t/p/w1280/${response.poster_path}`,
        homepage: response.homepage,
        overview: response.overview,
        releaseDate: response.release_date,
        voteAvg: response.vote_average,
        voteCount: response.vote_count,
        genres: response.genres.map(el=>el.name),
        trailerUrl: `https://www.youtube.com/watch?v=${video.results[0].key}`
    }
    return movie;    
}