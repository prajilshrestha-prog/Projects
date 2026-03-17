import { useEffect, useState } from "react";
import client from "../api/client.js";
import helpers from "../utils/helpers.js";
import EditableTimerList from "./EditableTimerList.jsx";
import ToggleableTimerForm from "./ToggleableTimerForm.jsx";
function TimersDashboard() {
    
    const [timers, setTimers] = useState([]);
    useEffect(() => {
        loadTimersFromServer();
        const intervalId = setInterval(loadTimersFromServer, 5000); 
        return () => clearInterval(intervalId); 
    }, []);
    

    const loadTimersFromServer = () => {
        client.getTimers((serverTimers) => {
            setTimers(serverTimers);
        });
    };
   
    const handleCreateFormSubmit = (timer) => {
        createTimer(timer);
    };
    const handleEditFormSubmit = (attrs) => {
        updateTimer(attrs);
    };
   const handleTrashClick = (timerId) => {
deleteTimer(timerId);
    };
   const handleStartClick = (timerId) => {
startTimer(timerId);
    };
   const handleStopClick = (timerId) => {
stopTimer(timerId);
    };
    const createTimer = (timer) => {
        const t = helpers.newTimer(timer)
        setTimers([...timers, t]);
        client.createTimer(t);
    }
    const updateTimer = (attrs) => {
        setTimers(
            timers.map((timer) => {
                if (timer.id === attrs.id) {
                       return {
          ...timer,
          title: attrs.title,
          project: attrs.project,
        };
                
                } else {
                    return timer;
                }
            }),
        )
 client.updateTimer({ id: attrs.id, title: attrs.title, project: attrs.project });    }
    const deleteTimer = (timerId) => {
        setTimers(
            timers.filter(t=>t.id!==timerId)
        )
        client.deleteTimer(
{ id: timerId })
    }
    const startTimer = (timerId) => {
        const now = Date.now();
        setTimers(
            timers.map((timer) => {
                if (timer.id === timerId) {
                    return {
                        ...timer,
                        runningSince: now,
                    }
                } else {
                    return timer;
                }
               
            }),
        )
        client.startTimer({ id: timerId, start: now });
    }
    const stopTimer = (timerId) => {
        const now = Date.now();
        setTimers(
            timers.map((timer) => {
                if (timer.id === timerId) {
                    const lastElapsed = now - timer.runningSince;
                    return {
                        ...timer,
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince:null,
                    }
                } else {
                    return timer;
                }
            })
        )
        client.stopTimer({ id: timerId, stop: now });
    }
    
    
    
    return (
        <div>
            <EditableTimerList
                timers={timers}
                onFormSubmit={handleEditFormSubmit}
                onTrashClick={handleTrashClick}
                onStartClick={handleStartClick}
onStopClick={handleStopClick}
            />
            <ToggleableTimerForm
                onFormSubmit={handleCreateFormSubmit}
            />
        </div>
    );
}
export default TimersDashboard;