
// Book class
class Book {
    constructor(title, author, isbn, numOfPages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.numOfPages = numOfPages;
    }
}

// UI class

class UI{
    static displayBooks() {
        const StoredBooks = [
            {
                title: 'Book One',
                author: 'John Doe',
                isbn: '54456456',
                numOfPages: '550'
            },
            {
                title: 'Book Two',
                author: 'Bousissss',
                isbn: '544562354',
                numOfPages: '650'
            }
        ];

        const books = StoredBooks;

        books.forEach(book => UI.addBookToLibrary(book));
    }

    // Add book to library
    static addBookToLibrary(book){
        const list = document.querySelector('#book-list');
    }
}

