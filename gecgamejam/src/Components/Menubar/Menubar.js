import React, { useEffect, useState } from 'react'
import './Menubar.css'
import {NavLink} from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';

const Menubar = ({userData}) => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    signOut(auth).then(()=>{
        window.location.reload();
    }).catch((error)=>{
        console.log("error", error)

    })
  };

  useEffect(() => {
    //if user is logged in
    const unSubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("the User is Logged in");
        setUser(user);
      }
      else{
        console.log("user is logged out");
      }
    });
  });

  return (
    <div className="menubar">
      <div className='titleDiv'>
        {console.log(userData)}
        <NavLink to={{pathname: '/'}}><h1 className='title'>GEC Game Jam</h1></NavLink>
        <h3 className='subTitle'><i>St. Johnsbury Academy</i></h3>
      </div>
      {userData 
        ? <div className={"navLink"}>
            <h1 className={"log"}>{userData.displayName}</h1>
            <h1 className={"log pointer"} onClick={handleLogout}>LogOut</h1>
          </div>
        : <NavLink to={{pathname: '/login'}} className={"navLink"} >Login</NavLink>
        }
    </div>
  )
}

export default Menubar
