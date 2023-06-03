import React, { useState } from "react";
import { db } from "./Firebase";
import { GoSearch } from "react-icons/go";
import { BsBookmarkPlusFill } from "react-icons/bs";

function BookSearch(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [booksFromSearch, setBooksFromSearch] = useState([]);
  const [errorBook, setErrorBook] = useState(false);
  const [indexRef, setIndexRef] = useState();
  const [errorSearch, setErrorSearch] = useState();
  const userId = props.userId;

  //search for books form the googlebooks api
  const searchBooks = async (e) => {
    e.preventDefault();
    setErrorBook(false);
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

  const addToLibrary = async (bookInfo, index) => {
    const authorcheck = !bookInfo.volumeInfo.authors
      ? "Unknown"
      : bookInfo.volumeInfo.authors.join("");

    const imgCheck = !bookInfo.volumeInfo.imageLinks
      ? "https://cdn2.iconfinder.com/data/icons/symbol-blue-set-3/100/Untitled-1-94-512.png"
      : bookInfo.volumeInfo.imageLinks?.thumbnail;

    const refinedBookInfo = {
      title: bookInfo.volumeInfo.title,
      author: authorcheck,
      imageUrl: imgCheck,
      id: bookInfo.id,
      bookStatus: false,
      owner: userId,
    };
    const dbRef = db.ref().child("books");
    const newBookRef = dbRef.push();
    const bookInDatabase = await isBookInDatabase(refinedBookInfo);
    if (bookInDatabase) {
      errorMessage(index);
      return;
    }
    newBookRef.set(refinedBookInfo);
    props.setDbControl(props.dbControl + 1);
  };

  if (errorSearch) {
    return (
      <div className="errorInSearch">
        {errorSearch}
        <form id="searchForm">
          <input
            id="inputSearch"
            placeholder="Which book are you looking for?"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button id="searchButton" onClick={searchBooks}>
            <GoSearch id="iconButton" />
          </button>
        </form>
      </div>
    );
  }

  const searchResults = booksFromSearch.map((book, index) => {
    return (
      <div key={index} className="booksInResults">
        <button className="addButton" onClick={() => addToLibrary(book, index)}>
          add book
          <BsBookmarkPlusFill className="addIcon" />
        </button>
        {errorBook && indexRef === index ? (
          <p className="errorMessage">Book already in library</p>
        ) : null}
        <h3 className="titleResult">{book.volumeInfo.title}</h3>
        <p className="authorResult">
          Author:{" "}
          {book.volumeInfo.authors
            ? book.volumeInfo.authors.join("")
            : "Unknown"}
        </p>
        <img
          className="imgResult"
          alt="book cover"
          src={
            !book.volumeInfo.imageLinks
              ? "https://cdn2.iconfinder.com/data/icons/symbol-blue-set-3/100/Untitled-1-94-512.png"
              : book.volumeInfo.imageLinks?.thumbnail
          }
        />
      </div>
    );
  });

  return (
    <div>
      <div className="header">
        <form id="searchForm">
          <input
            id="inputSearch"
            placeholder="Which book are you looking for?"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button id="searchButton" onClick={searchBooks}>
            <GoSearch id="iconButton" />
          </button>
        </form>
      </div>
      <div className="searchResults">{searchResults}</div>
    </div>
  );
}

export default BookSearch;
