// export default Login;
import React, { useEffect, useState } from "react";
import "./Login.css";
import loginImg from "./hehe.png";
import { signInWithPopup, signOut } from "firebase/auth"; //추가
import { auth, provider } from "../Firebase/Firebase";
import Menubar from "../Menubar/Menubar";
import { useNavigate } from "react-router-dom";
import { get, getDatabase, ref, set } from "firebase/database";


const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        const db = getDatabase();

        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          set(userRef, {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            isAdmin: false,
          });
          console.log("user added to database");
        }

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
      }
    });
  });

  const handleLogout = () => {
    signOut(auth).then(()=>{
        window.location.reload();
    }).catch((error)=>{
        console.log("error", error)
    })
  };

  return (
    <div className="login" style={{overflow:"hidden"}}>
      <Menubar />
      <img className="loginImg" src={loginImg} alt="hehe" width={"30%"}/>
      {isLoggedIn 
        ? <button className="loginButton" onClick={handleLogout}>LogOut</button>
        : <button className="loginButton" onClick={handleGoogleLogin}>Login with Google</button>
      }
      {/* <button className="loginButton" onClick={handleGoogleLogin}>Login with Google</button> */}
    </div>
  );
}

export default Login;

