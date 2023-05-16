import React, { useState } from "react";
import { db } from "./Firebase";
import { GoSearch } from "react-icons/go";

//if there is an error in the search everyhting collapses

function BookSearch(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [booksFromSearch, setBooksFromSearch] = useState([]);
  const [errorBook, setErrorBook] = useState(false);
  const [indexRef, setIndexRef] = useState();
  const [errorSearch, setErrorSearch] = useState();

  //search for books form the googlebooks api
  const searchBooks = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
    );
    const data = await response.json();
    // const data = false; work on the design
    console.log(data.items);
    if (!data.items) {
      setErrorSearch("There was an error with your search, please try again");
      return;
    }
    setBooksFromSearch(data.items);
  };

  // const handleKeyDown = function (event) {
  //   event.preventDefault();
  //   if (event.keyCode === 13) {
  //     searchBooks();
  //   }
  // };

  //check if the book that you clicked on is already in the library
  const isBookInDatabase = async (book) => {
    const dbRef = db.ref("books");

    const snapshot = await dbRef.once("value");
    const booksData = snapshot.val();

    const checkDatabase = Object.values(booksData || {}).find(
      (dbBook) => dbBook.id === book.id
    );
    return !!checkDatabase;
  };

  const errorMessage = function (index) {
    setErrorBook(true);
    setIndexRef(index);
  };

  //add a book to the library
  const addToLibrary = async (bookInfo, index) => {
    const refinedBookInfo = {
      title: bookInfo.volumeInfo.title,
      author: bookInfo.volumeInfo.authors.join(""),
      imageUrl: bookInfo.volumeInfo.imageLinks?.thumbnail,
      id: bookInfo.id,
      bookStatus: false,
    };
    const dbRef = db.ref().child("books");
    const newBookRef = dbRef.push();
    const bookInDatabase = await isBookInDatabase(refinedBookInfo);
    if (bookInDatabase) {
      errorMessage(index);
      return;
    }
    newBookRef.set(refinedBookInfo);
    props.setDbControl(props.dbConrtol + 1);
  };

  if (errorSearch) {
    return <div className="errorInSearch">{errorSearch}</div>;
  }

  const searchResults = booksFromSearch.map((book, index) => {
    return (
      <div key={index} className="booksInResults">
        <div>
          <h3>{book.volumeInfo.title}</h3>
          <p>
            Author:{" "}
            {book.volumeInfo.authors
              ? book.volumeInfo.authors.join("")
              : "Unknown"}
          </p>
          <img src={book.volumeInfo.imageLinks?.thumbnail} />
        </div>
        <button onClick={() => addToLibrary(book, index)}>
          Add to library
        </button>
        {errorBook && indexRef === index ? (
          <p>book already in library</p>
        ) : null}
      </div>
    );
  });

  return (
    <div className="containerFormAndResults">
      <form id="searchForm">
        <input
          id="inputSearch"
          placeholder="Which book are you looking for?"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // onKeyDown={handleKeyDown}
        />
        <button id="searchButton" onClick={searchBooks}>
          <GoSearch id="iconButton" />
        </button>
      </form>
      <div className="searchResults">{searchResults}</div>
    </div>
  );
}

export default BookSearch;
