
// Get input
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(e);

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const numOfPages = document.querySelector('#numofpages').value;

    // Create new book
    const book = new Book(title,author, isbn, numOfPages);
    
    // Validate input
    if(title == '' || author == '' || isbn == '' || numOfPages == ''){
        UI.showAlert('Please fill in all fields', 'danger');
    }else{
        // Add book to UI
        UI.addBookToLibrary(book);
        
        // Add book to local storage
        Store.addBook(book);   

        // Validate book addition
        UI.showAlert('Book added to library', 'success');

        // Clear form fields
        UI.clearFields();

        // Checkbox

    }
});
// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from local storage
    const isbn = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    Store.removeBook(isbn);

    // Delete book from UI
    if(e.target.className == "delete-button"){
        UI.deleteBook(e.target);
    }
    
});

// Event: Read status check box
window.addEventListener('DOMContentLoaded', (event) => {
    var boxes = document.querySelectorAll("input[type='checkbox']");
    boxes.forEach((box) => {
        box.addEventListener('change', (e) => {
            books = Store.getBooks();
            books.forEach((book) => {
                console.log(book);
                // ISBN
                let isbn = e.target.parentElement.previousElementSibling.previousElementSibling.innerText;
                if(e.target.checked && (isbn == book.isbn)){
                    book.status = true;
                    console.log(book.status);
                }else if(!e.target.checked && (isbn == book.isbn)){
                    book.status = false;
                    console.log(book.status);
                }
                // localStorage.setItem(box.checked, book.status);
                // Add new read status to storage
                Store.removeBook(isbn);
                Store.addBook(book);
            });
        })
    })
});

// Book class
class Book {
    constructor(title, author, isbn, numOfPages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.numOfPages = numOfPages;
        // Book read status
        this.status = false;
    }
}

// UI class
class UI{
    
    // Add book to library
    static addBookToLibrary(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.title}</td>
                         <td>${book.author}</td>
                         <td>${book.isbn}</td>
                         <td>${book.numOfPages}</td>
                         <td><input type='checkbox'></input></td>
                         <td><button class='delete-button'>X</button></td>`
        ;
        list.appendChild(row);    
                  
    }

    // Display books
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(book => {         
            UI.addBookToLibrary(book);
        })
    }

    // Show alert
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector(`.alert-${className}`).remove(), 3000);
    }

    // Clear fields
    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
        document.querySelector('#numofpages').value='';
    }

    // Delete book
    static deleteBook(book){
        book.parentElement.parentElement.textContent='';
    }

    // Display if book is read
    static isRead(){
        // let boxes = document.querySelectorAll("input[type='checkbox']");
        // let books = Store.getBooks();
        // books.forEach((book) => {
        //     boxes.forEach((box) => {
        //         // ISBN
        //         console.log(box);
        //         let isbn = box.parentElement.previousElementSibling.previousElementSibling.innerText;
        //         box.checked = book.status;
        //     });
        // });
    }
}

// Store class: Handles storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }else{
            // Use JSON parse to save as array, not as string
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        // Get local storage books
        const books = Store.getBooks();

        // Add book to storage
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        // Get local storage books
        const books = Store.getBooks();

        // Remove book from storage
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
