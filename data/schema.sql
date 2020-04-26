DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT,
    bookshelf VARCHAR(255)
);
INSERT INTO books(image_url,title,author,description,isbn)
VALUES(
      'https://books.google.jo/books/content?id=tk85AAAAIAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71YTrcg4VvRDfhr_4eAeNASbSsnK2PRRHr9fmBhpqAqn5CgXFrLnqKWALI-wKBGpMK0be-eKh57Tiw-yRJcyFvQhrmlfnuKqwMNqtz0w3kkbYEXnzbb9Fzsl9m18g1T3hs7GwDD',
    'Language in the USA',
    'Charles A. FergusonCharles A. Ferguson, Dell H. Hymes, Shirley Brice Heath, David Hwang',
    'Language in the USA is a volume of specially commissioned studies on the language situation in America, how it came to be the way it is, and the forces of changes within it. The USA has its own unique pattern of languages: American English, the principal language, different in structure and use from other kinds of English in the world; two hundred American Indian languages, some of them flourishing as never before; Spanish, spoken in North America before English and now the second most important language in the country; a cost of immigrant',
    '9780521298346'
 

);