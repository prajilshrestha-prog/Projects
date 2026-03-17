import { useState } from "react";
import TimerForm from "./TimerForm.jsx";
function ToggleableTimerForm(props) {
    const [isOpen, setIsOpen] = useState(false);
   const handleFormOpen = () => {
       setIsOpen(true);
    
    }
    const handleFormClose = () => {
        setIsOpen(false);
    }
    const handleFormSubmit = (timer) => {
        props.onFormSubmit(timer);
        setIsOpen(false);
    };
    if (isOpen) {
        
        return (
             <div className="overlay">
      <div className="timer-form">
            <TimerForm
                onFormSubmit={handleFormSubmit} 
                        onFormClose={handleFormClose}
                        
                    /></div>
                </div>
            
        );
    } else {
        return (
            <div  className="toggle-button">
                <button onClick={handleFormOpen}>+</button>
            </div>
        );
    }
}
export default ToggleableTimerForm;