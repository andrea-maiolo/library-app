import React from "react";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { db } from "./Firebase";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { BsBookmarkXFill } from "react-icons/bs";

const MyLibrary = (props) => {
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    const dbRef = firebase.database().ref("books");

    dbRef.on("value", (snapshot) => {
      const booksData = snapshot.val();

      const booksList = Object.entries(booksData || {}).map(([key, value]) => ({
        idOfDb: key,
        ...value,
      }));
      console.log(booksList, "boksdata");
      setMyBooks(booksList);
    });

    return () => {
      dbRef.off("value");
    };
  }, [props.dbControl]);

  console.log(myBooks, "mybook");

  const changeStatus = function (book) {
    const idToChange = book.idOfDb;
    const bookRef = db.ref("books/" + idToChange + "/bookStatus");
    bookRef.transaction((currentValue) => {
      return !currentValue;
    });
  };

  const deleteBook = function (book) {
    console.log(book);
    const idToDelete = book.idOfDb;
    const bookRef = db.ref("books/" + idToDelete);
    bookRef
      .remove()
      .then(() => {
        console.log("book removed");
      })
      .catch((error) => {
        console.error(error, "ther was an error");
      });
  };

  const booksInMyLibrary = myBooks.map((book, index) => {
    return (
      <div key={index} className="singleBookInLibrary">
        <div className="statusContainer">
          Status
          {book.bookStatus ? (
            <BsBookmarkCheckFill className="statusIcon" />
          ) : (
            <BsBookmarkXFill className="statusIcon" />
          )}
        </div>
        <h3 className="bookTitleLibrary">Title: {book.title}</h3>
        <p className="bookAuthorLibrary">Author: {book.author}</p>
        <img className="bookImgLibrary" alt="book cover" src={book.imageUrl} />
        <button className="statusButton" onClick={() => changeStatus(book)}>
          read/unread
        </button>
        <button className="deleteButton" onClick={() => deleteBook(book)}>
          <RiDeleteBin6Fill className="deleteIcon" />
        </button>
      </div>
    );
  });

  return (
    <div className="myLibrary">
      <h2 id="myBooks">My Books</h2>
      <div className="booksInMyLibrary">{booksInMyLibrary}</div>
    </div>
  );
};

export default MyLibrary;
