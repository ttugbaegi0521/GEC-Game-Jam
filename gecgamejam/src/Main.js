// import './App.css';
import { useEffect, useState, useRef } from 'react';
import Menubar from './Components/Menubar/Menubar';
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import style from './Main.module.css';
import icon from './Assets/Icon/icon-512.png';

function Main() {
  const [jamData, setJamData] = useState(null);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const imgRef = useRef(null);

  useEffect(() => {
    if(jamData === null) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 1000);
    }

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });

  function getJamData(){
    const db = getDatabase();
    const jamRef = ref(db, 'jam');
    onValue(jamRef, (snapshot) => {
      const data = snapshot.val();
      if (data == null) return;

      // console.log(data);
  
      const updatedData = Object.entries(data).reduce((acc, [key, value]) => {
        // Convert the date with time
        const jamDate = new Date(value.date + " " + value.time);
  
        // If the date is in the future, add it to the updated data
        if(jamDate > new Date()){
          acc[key] = value;
        } else {
          // If the date is in the past, remove it from the database
          const jamToRemoveRef = ref(db, `jam/${key}`);
          remove(jamToRemoveRef);
        }
  
        return acc;
      }, {});
  
      setJamData(Object.values(updatedData));
    });
  }

  const maxWords = 100; // Set the maximum number of words

  function truncateDescription(description) {
    let words = description.split(" ").splice(0, maxWords).join(" ");
    
    for (let j = 0; j < 10; j++) {
      if (words[words.length - j] === ".") {
        words = words.substring(0, words.length - j) + "...";
        return words;
      }
    }
    return words + "...";
  }

  function navigateJam(name){
    console.log('/jam/' + name.replace(" ", '-'));
    navigate('/jam/' + name.replace(" ", '-'));
  }
  
  function displayJamData(){
    if(jamData == null){
      getJamData();
    }
    else{
      var elements = [];
        for(let i = 0; i < jamData.length; i++){
        //calculate time left
        // var timeLeft = new Date(jamData[i].date) - time;
        var diff = new Date(jamData[i].date + " " + jamData[i].time) - time;
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var mins = Math.floor(diff / 1000 / 60);
        diff -= mins * 1000 * 60;
        var secs = Math.floor(diff / 1000);
        
        if(hours < 10) hours = "0" + hours;
        if(mins < 10) mins = "0" + mins;
        if(secs < 10) secs = "0" + secs;
        
        var timeLeftString = hours + ": " + mins + ": " + secs;
        elements.push(
          <div className={style.jam} key={i} onClick={() => navigateJam(jamData[i].name)}>
              <div className={style.jamCard} style={{ backgroundColor: jamData[i].color }}>
                  <h1 className={style.jamName}>{jamData[i].name}</h1>
                  <div className={style.jamTimeDescription}>
                      <div className={style.jamTimeContent}>
                          <h2 className={style.jamTimeDesc}>Ends in</h2>
                          <h2 className={style.jamTime}>{timeLeftString}</h2>
                      </div>
                  </div>
              </div>
              <div className={style.jamDescription}>
                  <div className={style.jamDescriptionContent}>
                      {/* <img src={jamData[i].image} alt='Jam' className='jamImage' /> */}
                      <img src={"https://resources.finalsite.net/images/f_auto,q_auto/v1666576418/sjajejukr/sw42kuuzkcwhmj59kya8/Thumbnail.png"} alt='Jam' className={style.jamImage} />
                      <div className={style.jamText}>
                          <h3 className={style.jamCardDescription}>{truncateDescription(jamData[i].description)}</h3>
                      </div>
                  </div>
              </div>
          </div>)
        
    }
      return(
        <div className={style.jamWrap}>
          {elements}
        </div>
      )
    }
  }

  return (
    <div className={style.App}>
      <div className={ jamData != null ? `${style.fadeOut} ${style.loadScreen}` : `${style.fadeIn} ${style.loadScreen}` }>
        <img ref={imgRef} src={icon} alt='icon' className={style.load} />
        <h1 className={style.loadText}>Loading...</h1>
      </div>
      
      <Menubar />
      <div className={style.main}>
        {displayJamData()}
      </div>
    </div>
  );
}

export default Main;