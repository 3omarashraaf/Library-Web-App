const fetch = require('node-fetch');

module.exports.fetchTvshows = async (searchKey) => {
    const query = new URLSearchParams({ query: searchKey }).toString()
    const url = (`https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_KEY}&${query}`)
    const response = await fetch(url) 
    .then(response => response.json());
    var tvshows = []
    if(response){
       if (response.total_results>0){ 
        for (tvshow of response.results) {    
                const newMovie = {
                    id: tvshow.id,
                    title: tvshow.name,
                    overview: tvshow.overview,
                    releaseDate: tvshow.first_air_date,
                    voteAvg: tvshow.vote_average,
                    voteCount: tvshow.vote_count,
                    poster: tvshow.poster_path
                }
                tvshows.push(newMovie)
            }
         }
    }
    return tvshows;
}


module.exports.fetchOneTvshow = async (id) => {
    const movieUrl = (`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`)
    const response = await fetch(movieUrl) 
    .then(response => response.json());
     const tvshow = {
         id: response.id,
         title: response.original_name,
         numberOfSeasons: response.number_of_seasons,
         language: response.original_language,
         posterUrl: `https://image.tmdb.org/t/p/w1280/${response.poster_path}`,
         homepage: response.homepage,
         overview: response.overview,
         releaseDate: response.first_air_date,
         voteAvg: response.vote_average,
         voteCount: response.vote_count,
         genres: response.genres.map(el=>el.name),
     }
     return tvshow;    
}