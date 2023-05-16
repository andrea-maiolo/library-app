import React from "react";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { db } from "./Firebase";
import { RiDeleteBin6Fill } from "react-icons/ri";

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
      setMyBooks(booksList);
    });

    return () => {
      dbRef.off("value");
    };
  }, [props.dbControl]);

  //how does it know to change when deleting a book?

  const changeStatus = function (book) {
    const idToChange = book.idOfDb;
    const bookRef = db.ref("books/" + idToChange + "/bookStatus");
    bookRef.transaction((currentValue) => {
      return !currentValue;
    });
  };

  const statusStyle = {
    backgroundColor: "#CF2A47",
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
      <div
        key={index}
        className="singleBookInLibrary"
        style={book.bookStatus ? statusStyle : null}
      >
        <h3 className="bookTitleLibrary">Title: {book.title}</h3>
        <p>Author: {book.author}</p>
        <img src={book.imageUrl} />
        <button onClick={() => changeStatus(book)}>read/unread</button>
        <button onClick={() => deleteBook(book)}>
          <RiDeleteBin6Fill className="deleteIcon" />
        </button>
      </div>
    );
  });

  return (
    <div className="myLibrary">
      <h2>My Books</h2>
      <div className="booksInMyLibrary">{booksInMyLibrary}</div>
    </div>
  );
};

export default MyLibrary;
