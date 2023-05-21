import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyCm6xkt0L3o-0TBaKbFw9oW83v4I0f25fA",
  authDomain: "library-app-29426.firebaseapp.com",
  databaseURL:
    "https://library-app-29426-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "library-app-29426",
  storageBucket: "library-app-29426.appspot.com",
  messagingSenderId: "805195377809",
  appId: "1:805195377809:web:220ee6371d3209e4f36330",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
