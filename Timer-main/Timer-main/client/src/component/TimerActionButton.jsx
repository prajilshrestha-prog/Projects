function TimerActionButton(props) {
    if (props.timerIsRunning) {
        return (
            <div className="stop">
                <button onClick={props.onStopClick}>Stop</button>
            </div>
        );
    } else {
        return (
            <div className="start">
                <button onClick={props.onStartClick}>Start</button>
            </div>
        );
    }
}
export default TimerActionButton