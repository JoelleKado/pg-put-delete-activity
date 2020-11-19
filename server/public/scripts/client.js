$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
  $('#bookShelf').on('click', '.deleteButton', deleteBook);
  $('#bookShelf').on('click', '.markReadButton', markRead);

});

function markRead() {
  console.log('enter markRead');
  let idToUpdate = $(this).closest('tr').data('id');
console.log('idToUpdate', idToUpdate);
  let readObject = {
    read : 'yes'
  }
  
  $.ajax({
    method: 'PUT', //update
    url: `/books/${idToUpdate}`,//req.params
    data: readObject //req.body
  }).then(function(response){
    console.log(response);
    refreshBooks();
  }).catch(function(){
    
  })
  
  
}

//delete a book from the database
function deleteBook() {
  console.log('ENTER deleteBook');
  console.log($(this));
  //need id of song i wish to delete
let idToDelete = $(this).closest('tr').data('id')
  console.log('idToDelete', idToDelete);

  $.ajax({
        method: 'DELETE',
        url: `/books/${idToDelete}` //add id to the url
    }).then( function(response) {
      console.log(response);
        refreshBooks();
    }).catch( function(error){
        console.log('Error:', error);
        alert('Something bad happened. Try again later');
    })
}

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server ln48.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  console.log('ENTER renderBooks');
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
let $tr = $(`<tr data-id="${book.id}"></tr>`);
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);

    $tr.append(`<button class="deleteButton">Delete</button>`);
    $tr.append(`<button class="markReadButton">Mark Read</button>`);

    $('#bookShelf').append($tr);
  }
}
