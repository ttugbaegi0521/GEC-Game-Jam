import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { auth, storage } from "../Firebase/Firebase";
import { ref as storageRef, uploadBytesResumable } from "firebase/storage";
import Menubar from "../Menubar/Menubar";
import style from "./Jam.module.css";
import { get, getDatabase, set, ref, update } from "firebase/database";

const Jam = () => {
    const { jamId } = useParams();
    const [gameName, setGameName] = useState("");
    const [file, setFile] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [canUpload, setCanUpload] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        //check if jamId exists
        auth.onAuthStateChanged(async (user) => {
            const db = getDatabase();
            const userRef = ref(db, "users/" + user.uid);
            const jamRef = ref(db, "jam/" + jamId);
            const jamSnapshot = await get(jamRef);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                setCanUpload(userSnapshot.val().canUpload);
            }else{
                setCanUpload(false);
            }
            if (jamSnapshot.exists()) {
                console.log("jam exists");
            }
            else {
                navigate("/");
            }
            
        });
    }, [jamId, navigate]);

    const handleChange = setter => event => setter(event.target.value);
    const handleUploadFile = setter => event => setter(event.target.files[0]);
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page from refreshing
        if (gameName === "" || gameDescription === "") {
            alert("Please fill out all fields");
            return;
        }
    
        if (file === "") {
            alert("Please upload a file");
            return;
        }
    
        handleUpload();
    
    }
        

    function handleUpload() {
        if (!file) {
            alert("Please choose a file first!")
        }
        if(canUpload === false){
            alert("You are not allowed to upload games!");
            navigate("/");
            return;
        }

        //upload to gaems/jamId/file.name
        const fileRef = storageRef(storage, 'games/' + jamId + '/' + file.name);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            console.log('Upload is starting');
        }, (error) => {
            console.log(error);
        }, async () => {
            console.log('Upload complete');
            const db = getDatabase();
            const userRef = ref(db, "users/" + auth.currentUser.uid);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                //update user canUpload to false and don't change anything else
                update(ref(db, 'users/' + auth.currentUser.uid), {
                    canUpload: false
                });
            }
            else{
                return
            }

            const fileName = file.name;

            //add to game/jamId
            set(ref(db, 'games/' + jamId + '/' + fileName.replace(".zip", "")), {
                name: gameName,
                description: gameDescription,
                fileName: fileName
            });

            setGameName("");
            setGameDescription("");
            setFile("");


            alert("Upload complete");

            navigate("/")
        });
    }


    return (
        <div>
            <Menubar />
            <div className={style.jamSubmit}>
                <h1 className={style.jamTitle}>Submit Your Game</h1>
                <h1 className={style.jamName}>{jamId}</h1>
            </div>
            <h1 className={style.jamNote}>*You can submit only ONE game per Jam</h1>
            <hr/>
            <div className={style.jamSubmitInfo}>
                <h1 className={style.jamInputInfo}>Game Name</h1>

                <form onSubmit={handleSubmit} className={style.jamSubmitInfo}>
                    <input id={style.jamInput} type="text" placeholder="Game Name" value={gameName} onChange={handleChange(setGameName)} />
                    <input id={style.jamInput} type="text" placeholder="Description" value={gameDescription} onChange={handleChange(setGameDescription)} />
                    <input id={`${style.jamInput}`} className={style.inputStyle} type="file" placeholder="Upload Game" accept=".zip" onChange={handleUploadFile(setFile)} />
                    <button id={style.btn} type="submit">Submit</button>
                </form>
                {/* <button id={style.btn} onClick={(e) => {
                    e.preventDefault(); // Prevents page from refreshing

                    writeGameData(gameName, gameDescription, file)}
                }>Submit</button> */}
            </div>
        </div>
    );
}

export default Jam;