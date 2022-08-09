const {fetchTvshows,fetchOneTvshow} = require('../utils/fetchTvshows');
const Tvshow = require('../models/tvshow');
const Review = require('../models/review');

module.exports.index = async(req,res) => {
    const tvshows = await Tvshow.find({})
    res.render('tvshows/index',{tvshows})
}
module.exports.createTvshow = async(req,res) => {}
module.exports.showEditPage = async(req,res) => {}
module.exports.editTvshow = async(req,res) => {}
module.exports.deleteTvshow = async(req,res) => {}
module.exports.showOneTvshow = async(req,res) => {
    const tvshow = await Tvshow.findOne({id: req.params.id}).populate({path:'reviews',populate:{path:'user'}})
    if(!tvshow){
        req.flash('error',`Sorry we don't have that tvshow`)
        res.redirect('/tvshows')
    }
    res.render('tvshows/show',{tvshow})
}
module.exports.search = async(req,res) => {
    const tvshows = await fetchTvshows(req.query.searchKey)
    res.render('tvshows/searchResult',{tvshows})
}

module.exports.addReview = async(req,res)=>{
    const id = req.params.id
    const tvshow = await Tvshow.findOne({id})
    const review = new Review(req.body.review)
    review.user = req.session.user.user_id
    tvshow.reviews.push(review)
    await review.save()
    await tvshow.save()
    res.redirect(`/tvshows/${id}`)
}
module.exports.deleteReview = async(req,res)=>{
    const {id, reviwID} = req.params
    await Tvshow.findOneAndUpdate({id},{$pull: {reviews: reviwID}});
    await Review.findByIdAndDelete(reviwID)
    res.redirect(`/tvshows/${id}`)
}
