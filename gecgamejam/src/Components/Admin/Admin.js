import React, { useEffect, useState } from "react";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import style from "./Admin.module.css";
import Menubar from "../Menubar/Menubar";
import { auth } from "../Firebase/Firebase";

const Admin = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [img, setImg] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [jamData, setJamData] = useState(null);

    function writeGameData(name, date, description, color) {
        const db = getDatabase();
        set(ref(db, 'jam/' + name), {
            name,
            date,
            description,
            color,
            img,
            time
        });

        setName("");
        setDate("");
        setDescription("");
        setColor("");
        setImg("");
        setTime("");

        window.location.reload();
    }

    function getJamData(){
        const db = getDatabase();
        const jamRef = ref(db, 'jam');

        onValue(jamRef, (snapshot) => {
          const data = snapshot.val();
          if (data == null) return;
          setJamData(Object.values(data));
        });
    }

    function editJam(){
        const db = getDatabase();
        if(!db) return;
        var elements = [];
        if (!jamData) return;
        for(var i=0;i < jamData.length; i++){
            elements.push(
                <div className={style.editContent} key={i}>
                    <h1>{jamData[i].name}</h1>
                    <button id="deleteBtn" onClick={() => {
                        set(ref(db, 'jam/' + jamData[i].name), null);
                        window.location.reload();
                    }}>Delete</button>
                </div>
            )
        };
        console.log(jamData);

        return (
            <div>
                {elements}
            </div>
        );
    }

    useEffect(() => {
        const delayAtLoad = () => {
            setTimeout(() => {
            }, 2000);
        }
        delayAtLoad();
        getJamData();
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
                }else{
                    setIsAdmin(false);
                }
                console.log(isAdmin);
            }
        });
    }, [isAdmin]);

    const handleChange = setter => event => setter(event.target.value);

    return (
        <div className={style.admin}>
            <Menubar />
            <div className={style.adminContent}>
                {isAdmin 
                ? 
                <div>
                    <fieldset>
                        <legend>Add Jam</legend>
                        <input type="text" placeholder="Name" id={style.input} onChange={handleChange(setName)} />
                    
                        <input type="date" placeholder="Date" id={style.input} onChange={handleChange(setDate)}/>
                        <input type="time" placeholder="Time" id={style.input} onChange={handleChange(setTime)}/>
                        
                        <input type="text" placeholder="Description" id={style.input} onChange={handleChange(setDescription)}/>

                        <h2 style={{color: "white", fontSize:"10px", margin: "0px", marginRight:"calc(30vw - 25px)"}}>Color:</h2>
                        <input type="color" placeholder="Color" id={style.input} onChange={handleChange(setColor)}/>

                        <input type="text" placeholder="Img" id={style.input} onChange={handleChange(setImg)}/>

                        <button id={style.btn} onClick={() => {
                            if(!isAdmin) return;
                                writeGameData(name, date, description, color, img)}
                            }>Submit</button>
                    </fieldset>

                    <fieldset>
                        <legend>Edit Jam</legend>
                        {editJam()}
                    </fieldset>
                </div>
                : <h1 className={style.load}>Loading...</h1>
            }
            </div>
        </div>
    );
}

export default Admin;