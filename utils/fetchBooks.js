const fetch = require('node-fetch');

module.exports = async (searchKey) => {
    const url = ('https://www.googleapis.com/books/v1/volumes?' + new URLSearchParams({ q: searchKey }).toString());
    const response = await fetch(url) 
    .then(response => response.json());
    var books = []
    for (item of response.items) {
        const bookData = item.volumeInfo
        if(bookData && bookData.title && bookData.description && bookData.authors[0] && 'imageLinks' in bookData ){
            const book = {
                title: bookData.title,
                description: bookData.description,
                author: bookData.authors[0],
                // isbn: bookData.industryIdentifiers.filter(element => element.type === 'ISBN_13' )[0].identifier,
                imgUrl: bookData.imageLinks.smallThumbnail || bookData.imageLinks.Thumbnail
            }
            books.push(book)
        }
    }
    return books;
}


