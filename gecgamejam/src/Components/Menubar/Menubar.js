import React, { useEffect, useState } from 'react'
import {NavLink} from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import { get, getDatabase, ref } from 'firebase/database';
import style from './Menubar.module.css';

const Menubar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    signOut(auth).then(()=>{
        window.location.reload();
    }).catch((error)=>{
        console.log("error", error)
    })
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

            const db = getDatabase();
            const userRef = ref(db, "users/" + user.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setIsAdmin(snapshot.val().isAdmin);
            }else{
                setIsAdmin(false);
            }
      }
      else{
        console.log("user is logged out");
      }
    });
  });

  return (
    <div className={style.wrapper}>
      <div className={style.menubar}>
        <div className={style.titleDiv}>
          <NavLink to={{pathname: '/'}}><h1 className={style.title}>GEC Game Jam</h1></NavLink>
          <h3 className={style.subTitle}><i>St. Johnsbury Academy</i></h3>
        </div>
        {user 
          ? <div className={style.navLink}>
            {isAdmin
              ? <NavLink to="/admin" user={user} className={style.adminLink}>{user.displayName + " (admin)"}</NavLink>
              : <h1 className={style.log}>{user.displayName}</h1>
            }
              <h1 className={`${style.log} ${style.pointer}`} onClick={handleLogout}>LogOut</h1>
            </div>
          : <NavLink to="/login" user={user} className={style.navLink}>Login</NavLink>
          }
      </div>
    </div>
  )
}

export default Menubar

