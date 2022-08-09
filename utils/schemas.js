const Joi = require('joi');

module.exports.bookSchema = Joi.object({
    book: Joi.object({
        title: Joi.string().required(),
        isbn: Joi.number().required().min(0),
        description: Joi.string().required(),
        imgUrl: Joi.string().required(),
        author: Joi.string().required()
    }).required()
})
module.exports.tvshowSchema = Joi.object({
    tvshow: Joi.object({
        title: Joi.string().required(),
        id: Joi.number().required().min(0),
        language: Joi.string().required(),
        releaseDate: Joi.string().required(),
        voteAvg: Joi.number().required().min(0),
        voteCount: Joi.number().required().min(0),
        numberOfSeasons: Joi.number().required().min(0),
        genres: Joi.array().required(),
        overview: Joi.string().required(),
        posterUrl: Joi.string().required(),
    }).required()
})
module.exports.movieSchema = Joi.object({
    tvshow: Joi.object({
        title: Joi.string().required(),
        imdbID: Joi.number().required().min(0),
        id: Joi.number().required().min(0),
        language: Joi.string().required(),
        releaseDate: Joi.string().required(),
        voteAvg: Joi.number().required().min(0),
        voteCount: Joi.number().required().min(0),
        genres: Joi.array().required(),
        overview: Joi.string().required(),
        posterUrl: Joi.string().required(),
    }).required()
})
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        text: Joi.string().required()
    }).required()
})

module.exports.userRegSchema = Joi.object({
    user: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required()
    }).required()
})
module.exports.userLoginSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).required()
})