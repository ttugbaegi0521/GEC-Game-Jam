// import React, { useEffect } from "react";
// import "./Login.css";
// import loginImg from "./hehe.png";
// import { signInWithPopup, signOut } from "firebase/auth"; //추가
// import { auth, provider } from "../Firebase/Firebase";

// //props로 받아온다
// const Login = ({setUser, user}) => {
//   // const [userData, setUserData] = useState(null);
//     const handleGoogleLogin = () => {
//       signInWithPopup(auth, provider) // popup을 이용한 signup
//         .then(async (result) => {
//           setUser(result.user); // user data 설정

//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }

//     const handleLogout = () => {
//       signOut(auth).then(()=>{
//           window.location.reload();
//       }).catch((error)=>{
//           console.log("error", error)
  
//       })
//     };

//     useEffect(() => {
//       const unSubscribe = auth.onAuthStateChanged((user) => {
//         if (user) {
//           console.log("the User is Logged in");
//           setUser(user);
//         }
//         else{
//           console.log("user is logged out");
//         }
//       });
  
//       return () => {
//         unSubscribe();
//       };
//     });

//     return (
//         <div className="login">
//             <img className="loginImg" src={loginImg} alt="hehe" width={"30%"}/>
//             {user 
//               ? <button className="loginButton" onClick={handleLogout}>LogOut</button>
//               : <button className="loginButton" onClick={handleGoogleLogin}>Login with Google</button>
//             }
//         </div>
//     );
// }

// export default Login;
import React, { useEffect, useState } from "react";
import "./Login.css";
import loginImg from "./hehe.png";
import { signInWithPopup, signOut } from "firebase/auth"; //추가
import { auth, provider } from "../Firebase/Firebase";
import { Navigate } from "react-router-dom";
import Menubar from "../Menubar/Menubar";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result.user);
        Navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user) => {
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
    <div className="login">
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

