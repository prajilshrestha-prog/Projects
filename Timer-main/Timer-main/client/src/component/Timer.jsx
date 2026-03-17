import { useEffect, useState } from "react";
import helpers from "../utils/helpers.js";
import TimerActionButton from "./TimerActionButton.jsx";

function Timer(props) {
    const [, setForceRender] = useState(0);

  useEffect(() => {
  const intervalId = setInterval(() => {
          setForceRender(prev => prev + 1);

  }, 50);

  return () => clearInterval(intervalId); 
  }, []);
  const handleStartClick = () => {
    props.onStartClick(props.id);
};
  const handleStopClick = () => {
  props.onStopClick(props.id);
};
  const elapsedString = helpers.renderElapsedString(
    props.elapsed + (props.runningSince ? Date.now() - props.runningSince : 0)
  
  );
const handleTrashClick = () => {
props.onTrashClick(props.id);
};
  return (
   <div className="timer-card">
      <h3>{props.title}</h3>
      <p>{props.project}</p>
      <h2>{elapsedString}</h2>
 <div className="timer-buttons">
      <span onClick={props.onEditClick}>
        <button>Edit</button>
      </span>
      <span onClick={handleTrashClick}>
        <button>Delete</button>
        </span>
      
        
      <TimerActionButton 
timerIsRunning={!!props.runningSince}
        onStartClick={handleStartClick}
        onStopClick={handleStopClick}
/>
      </div>
        </div>
  );
}

export default Timer;
