// import './App.css';
import { useEffect, useState } from 'react';
import Menubar from './Components/Menubar/Menubar';
import { getDatabase, ref, onValue } from "firebase/database";
import './Main.css';

function Main() {
  const [jamData, setJamData] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
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
      console.log(data);

      setJamData(Object.values(data));
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
  
  function displayJamData(){
    if(jamData == null){
      getJamData();
      return(
        <div>
          <h1 className='load'>Loading...</h1>
        </div>
      )
    }
    var elements = [];
    for(let i = 0; i < jamData.length; i++){

      //calculate time left (hrs, mins, secs)
      var date = new Date(jamData[i].date);
      var timeLeft = date - time;
      var hours = Math.floor(timeLeft / 3600000);
      timeLeft -= hours * 3600000;
      var mins = Math.floor(timeLeft / 60000);
      timeLeft -= mins * 60000;
      var secs = Math.floor(timeLeft / 1000);
      timeLeft -= secs * 1000;

      //format time left
      if(hours < 10) hours = "0" + hours;
      if(mins < 10) mins = "0" + mins;
      if(secs < 10) secs = "0" + secs;

      var timeLeftString = hours + ": " + mins + ": " + secs;
      elements.push(
        <div className='jam' key={i}>
            <div className='jamCard' style={{ backgroundColor: jamData[i].color }}>
                <h1 className='jamName'>{jamData[i].name}</h1>
                <div className="jamTimeDescription">
                    <div className='jamTimeContent'>
                        <h2 className='jamTimeDesc'>Ends in</h2>
                        <h2 className='jamTime'>{timeLeftString}</h2>
                    </div>
                </div>
            </div>
            <div className='jamDescription'>
                <div className='jamDescriptionContent'>
                    {/* <img src={jamData[i].image} alt='Jam' className='jamImage' /> */}
                    <img src={"https://resources.finalsite.net/images/f_auto,q_auto/v1666576418/sjajejukr/sw42kuuzkcwhmj59kya8/Thumbnail.png"} alt='Jam' className='jamImage' />
                    <div className='jamText'>
                        <h3 className='jamCardDescription'>{truncateDescription(jamData[i].description)}</h3>
                    </div>
                </div>
            </div>
        </div>)
    }
    return(
      <div>
        {elements}
      </div>
    )
  }

  return (
    <div className="App">
      <Menubar />
      <div className='main'>
        {displayJamData()}
      </div>
    </div>
  );
}

export default Main;