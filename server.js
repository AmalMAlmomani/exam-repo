'use strict';

//variables which contains the APIs keys and the database URL
require('dotenv').config();
//=> the node library which contains the server function
const express = require('express');
const superagent = require('superagent');
 //PORT
const PORT = process.env.PORT || 4000;
//connect the server with the database
const pg = require('pg');
//the server variable
const app = express();

//we use it when we create our functions for the routs in order to get the data from the APIs servers

//promise function => file in order to connect our server with the database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err =>  console.error(err));
//for use Update=PUT , delete=DELETE
const methodOverRide = require('method-override');
//===express server uses===\\
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverRide('_method'));


// ===Route==\\
app.get('/', indexHandler);

//a in index for render the detail
app.get('/addBookForm', renderForm);

//books detail
app.get('/booksDetail/:book_id', bookDetail);

//add to database
app.post('/addToDataBaseForm', addToDataBase);
//update
app.put('/update/:book_id', updateBook);
//delete 
app.delete('/delete/:book_id', deleteBook);
//form action constructor

app.get('/searches/new', bookSearch);
app.post('/searchNew',resultBook);
app.use('*', notFoundHandler);

//===function===\\
function indexHandler (req,res){
    const sql = 'SELECT * FROM books;';
 client.query(sql).then(result =>{
         res.render('./pages/index',{dataBaseBook:result.rows});
    })
    .catch(err => {
        errorHandler(err,req,res);
    });
    
}
function bookDetail(req,res){
    let sql = 'SELECT * FROM books WHERE id=$1;';
    let values = [req.params.book_id];
    return client.query(sql,values).then(result => {
        res.render('./pages/books/detail',{book:result.rows[0]}); 
    })
    .catch(err => {
        errorHandler(err,req,res);
    })
    
}
function renderForm(req,res){
    res.render('./pages/books/show');
    
}
function addToDataBase (req,res){
    //object
    let { title, author, description, isbn}= req.body;
    console.log(req.body);
    
    let sql = 'INSERT INTO books ( title, author, description, isbn) VALUES($1 ,$2 ,$3 ,$4);';
    let safeValue = [title, author, description, isbn];
    client.query(sql,safeValue).then(() =>{
        res.redirect('/');
    })
    .catch(err => {
        errorHandler(err,req,res);
    });

}


function updateBook(req,res) {
    let { title, author, description, isbn}= req.body;
    let sql = 'UPDATE books SET title=$1,author=$2,description=$3,isbn=$4 WHERE id=$5;';
    let safeValue =  [title, author, description, isbn,req.params.book_id]
    client.query(sql,safeValue).then(() => {
        res.redirect(`/booksDetail/${req.params.book_id}`);
    })
    .catch(err => {
        errorHandler(err,req,res);
    })
}


function deleteBook(req,res) {
    let sql = 'DELETE FROM books WHERE id=$1;';
    let values= [req.params.book_id];
    client.query(sql,values).then(() => {
        res.redirect('/')
    })
    .catch(err => {
        errorHandler(err,req,res);
    })
}


function bookSearch(req,res) {
    res.render('./pages/searches/new');  
}

function resultBook(req,res){
    const enter = req.body.enter;
    const radio = req.body.radioType;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${enter}&in${radio}=${enter}`;
    superagent.get(url).then(bookData => {
        const bookSummary = bookData.body.items.map(bookValue =>{
            return new Book(bookValue);
        })
        res.render('./pages/searches/show', { searchShow:bookSummary });
    })
    .catch(err =>{
        errorHandler(err,req,res);
    });
}


function Book(books) {
    this.title = books.volumeInfo.title ? books.volumeInfo.title : "Defult Title";
    this.author = books.volumeInfo.authors[0] ? books.volumeInfo.authors[0] : "Unknown Authors";
    this.image_url = books.volumeInfo.imageLinks.smallThumbnail ? books.volumeInfo.imageLinks.smallThumbnail : "No Image Found";
    this.isbn = books.volumeInfo.industryIdentifiers ? books.volumeInfo.industryIdentifiers[0].identifier : "No ISBN Found";
    this.description = books.volumeInfo.description ? books.volumeInfo.description : "No Description Found";
}


function notFoundHandler(req,res) {
    res.status(404).send('page not found');
}
function errorHandler(err,req,res){

    res.status(500).render('pages/error',{error:err});
}

//creating a client promise function and the listening to port
client.connect().then(() => {
    app.listen(PORT,() => console.log(` up on ${PORT}`));
});