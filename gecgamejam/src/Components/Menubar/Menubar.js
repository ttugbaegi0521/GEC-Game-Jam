import React, { useEffect, useState } from 'react'
import './Menubar.css'
import {NavLink} from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';

const Menubar = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    signOut(auth).then(()=>{
        window.location.reload();
    }).catch((error)=>{
        console.log("error", error)
    })
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
      else{
        console.log("user is logged out");
      }
    });
  });

  return (
    <div className='wrapper'>
      <div className="menubar">
        <div className='titleDiv'>
          <NavLink to={{pathname: '/'}}><h1 className='title'>GEC Game Jam</h1></NavLink>
          <h3 className='subTitle'><i>St. Johnsbury Academy</i></h3>
        </div>
        {user 
          ? <div className={"navLink"}>
              <h1 className={"log"}>{user.displayName}</h1>
              <h1 className={"log pointer"} onClick={handleLogout}>LogOut</h1>
            </div>
          : <NavLink to="/login" user={user} className="navLink">Login</NavLink>
          }
      </div>
    </div>
  )
}

export default Menubar

