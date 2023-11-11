import React, { useEffect, useState } from "react";
import Menubar from "../Menubar/Menubar";
import "./Login.css";
import loginImg from "./hehe.png";
import { signInWithPopup, signOut } from "firebase/auth"; //추가
import { auth, provider } from "../Firebase/Firebase";

//props로 받아온다
const Login = () => {
  const [userData, setUserData] = useState(null);
    const handleGoogleLogin = () => {
      signInWithPopup(auth, provider) // popup을 이용한 signup
        .then(async (result) => {
          setUserData(result.user); // user data 설정

        })
        .catch((err) => {
          console.log(err);
        });
    }

    const handleLogout = () => {
      signOut(auth).then(()=>{
          window.location.reload();
      }).catch((error)=>{
          console.log("error", error)
  
      })
    };

    useEffect(() => {
      const unSubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("the User is Logged in");
          setUserData(user);
        }
        else{
          console.log("user is logged out");
        }
      });
  
      return () => {
        unSubscribe();
      };
    });

    return (
        <div className="login">
            <Menubar userData={userData}/>
            <img className="loginImg" src={loginImg} alt="hehe" width={"30%"}/>
            {userData 
              ? <button className="loginButton" onClick={handleLogout}>LogOut</button>
              : <button className="loginButton" onClick={handleGoogleLogin}>Login with Google</button>
            }
        </div>
    );
}

export default Login;

