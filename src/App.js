import React, { useEffect, useState } from "react";
import { auth } from "./components/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";
import { GoSignOut } from "react-icons/go";
import BookSearch from "./components/BookSearch";
import MyLibrary from "./components/MyLibrary";

function App() {
  const [user] = useAuthState(auth);
  const [dbControl, setDbControl] = useState(0);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    setUserId(user.uid);
  }, [user]);

  return (
    <div className="App">
      <body>
        {user ? (
          <div className="main">
            <SignOut />
            <BookSearch
              dbControl={dbControl}
              setDbControl={setDbControl}
              userId={userId}
            />
            <MyLibrary
              dbControl={dbControl}
              setDbControl={setDbControl}
              userId={userId}
            />
          </div>
        ) : (
          <Login />
        )}
      </body>
    </div>
  );
}

const Login = () => {
  const [err, setErr] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setErr(error);
    }
  };

  if (err) {
    return (
      <div className="errorSignIn">
        <p>An error occured, sorry for the inconvenience try again later </p>
      </div>
    );
  }

  return (
    <div className="googleLogin">
      <button id="loginButton" onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
};

function SignOut() {
  return (
    auth.currentUser && (
      <div>
        <button className="sign-out" onClick={() => auth.signOut()}>
          Sign Out
        </button>
        <GoSignOut className="signOutIcon" onClick={() => auth.signOut()} />
      </div>
    )
  );
}

export default App;
