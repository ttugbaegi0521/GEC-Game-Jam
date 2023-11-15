import React, { useEffect, useState } from "react";
import { get, getDatabase, ref, set } from "firebase/database";
import "./Admin.css";
import Menubar from "../Menubar/Menubar";
import { auth } from "../Firebase/Firebase";

const Admin = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    function writeGameData(name, date, description, color) {
        const db = getDatabase();
        set(ref(db, 'jam/' + name), {
            name,
            date,
            description,
            color
        });

        setName("");
        setDate("");
        setDescription("");
        setColor("");

        window.location.reload();
    }

    useEffect(() => {
        const delayAtLoad = () => {
            setTimeout(() => {
            }, 2000);
        }
        delayAtLoad();
    }, []);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if(!user){
                window.location.href = "/login";
            } else {
                const db = getDatabase();
                const userRef = ref(db, "users/" + user.uid);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setIsAdmin(snapshot.val().isAdmin);
                }
            }
        });
    }, []);

    const handleChange = setter => event => setter(event.target.value);

    return (
        <div className="admin">
            <Menubar />
            <div className="adminContent">
                {isAdmin 
                ? <fieldset>
                    <legend>Game Jam</legend>
                    <input type="text" placeholder="Name" id="input" onChange={handleChange(setName)} />
                
                    <input type="date" placeholder="Date" id="input" onChange={handleChange(setDate)}/>
                    
                    <input type="text" placeholder="Description" id="input" onChange={handleChange(setDescription)}/>

                    <h2 style={{color: "white", fontSize:"10px", margin: "0px", marginRight:"calc(30vw - 25px)"}}>Color:</h2>
                    <input type="color" placeholder="Color" id="input" onChange={handleChange(setColor)}/>

                    <button id="btn" onClick={() => {
                        if(!isAdmin) return;
                            writeGameData(name, date, description, color)}
                        }>Submit</button>
                </fieldset>
                : <h1 className='load'>Loading...</h1>
            }
            </div>
        </div>
    );
}

export default Admin;