import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import Menubar from "../Menubar/Menubar";
import style from "./Jam.module.css";

const Jam = () => {
    const { jamId } = useParams();
    const [gameName, setGameName] = useState("");
    // const [gameDescription, setGameDescription] = useState("");

    const handleChange = setter => event => setter(event.target.value);

    return (
        <div>
            <Menubar />
            <div className={style.jamSubmitInfo}>
                <h1 className={style.jamTitle}>Submit Your Game</h1>
                <h1 className={style.jamName}>{jamId}</h1>
            </div>
            <h1 className={style.jamNote}>*You can submit only ONE game per Jam</h1>
            <hr/>
            <div className={style.jamSubmitInfo}>
                <h1 >Game Name</h1>
                <input id={style.jamInput} type="text" placeholder="Game Name" value={gameName} onChange={() => handleChange(setGameName)} />
            </div>
        </div>
    );
}

export default Jam;