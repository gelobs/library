
// Get input
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

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

        // Refresh page to get checkbox working
        // when initializing a book
        location.reload();
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
        UI.showAlert('Book removed', 'success');
    }
    
});

// Event: Read status check box
window.addEventListener('DOMContentLoaded', (event) => {
    var boxes = document.querySelectorAll("input[type='checkbox']");
    boxes.forEach((box) => {
        box.addEventListener('change', (e) => {
            books = Store.getBooks();
            books.forEach((book) => {
                // ISBN
                let isbn = e.target.parentElement.previousElementSibling.previousElementSibling.innerText;
                if(e.target.checked && (isbn == book.isbn)){
                    book.status = true;
                }else if(!e.target.checked && (isbn == book.isbn)){
                    book.status = false;
                }
                // localStorage.setItem(box.checked, book.status);
                // Add new read status to storage
                Store.removeBook(book.isbn);
                Store.addBook(book);
                
            });
        })
    })

});

// Book constructor
function Book(title, author, isbn, numOfPages){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.numOfPages = numOfPages;
}

// Load read status from storage
function loadReadStatus(){
    const books = Store.getBooks();
    books.forEach((book) => {
        let boxes = document.querySelectorAll("input[type='checkbox']");
        boxes.forEach((box) => {
            let isbn = box.parentElement.previousElementSibling.previousElementSibling.textContent;
            if (isbn == book.isbn){
                box.checked = book.status;
            }
        }); 
    });
}

// UI object
var UI = {
    addBookToLibrary: function(book){
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
    },

    displayBooks: function(){
        const books = Store.getBooks();
        books.forEach(book => {         
            UI.addBookToLibrary(book);
        });
    },

    showAlert: function(message, className){
        const div = document.createElement('div');
        div.className = `alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector(`.alert-${className}`).remove(), 3000);
    },

    clearFields: function (){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
        document.querySelector('#numofpages').value='';
    },

    deleteBook: function(book){
        book.parentElement.parentElement.textContent='';
    }
};

// Store object: handles storage
var Store = {
    getBooks: function(){
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }else{
            // Use JSON parse to save as array, not as string
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    },

    addBook: function(book){
        // Get local storage books
        const books = Store.getBooks();

        // Add book to storage
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));     
    },

    removeBook: function(isbn){
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
document.addEventListener('DOMContentLoaded', UI.displayBooks());
document.addEventListener('DOMContentLoaded', loadReadStatus());