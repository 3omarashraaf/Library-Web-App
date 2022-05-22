const fetchBooks = require('../utils/fetchBooks');

module.exports.search = async(req,res)=>{
    const books = await fetchBooks(req.body.searchKey)
    console.log(books)
    res.render('searchResult',{books: books })
}