const {fetchTvshows,fetchOneTvshow} = require('../utils/fetchTvshows');
const Tvshow = require('../models/tvshow');

module.exports.index = async(req,res) => {
    const tvshows = await Tvshow.find({})
    res.render('tvshows/index',{tvshows})
}
module.exports.createTvshow = async(req,res) => {}
module.exports.showEditPage = async(req,res) => {}
module.exports.editTvshow = async(req,res) => {}
module.exports.deleteTvshow = async(req,res) => {}
module.exports.showOneTvshow = async(req,res) => {
    const tvshow = await fetchOneTvshow(req.params.id)
    res.render('tvshows/show',{tvshow})
}
module.exports.search = async(req,res) => {
    const tvshows = await fetchTvshows(req.query.searchKey)
    res.render('tvshows/searchResult',{tvshows})
}