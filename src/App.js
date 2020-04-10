import React from "react";
import usePomodoro, { formatTime } from "./usePomodoro";
import "./styles.css";

export default function App() {
  const [
    state,
    { play, pause, reset, setTimeFocus, setTimeShortBreak, setTimeLongBreak }
  ] = usePomodoro();

  return (
    <div className="App">
      <div>
        <button onClick={() => setTimeFocus()}>FOCUS</button>
        <button onClick={() => setTimeShortBreak()}>SHORT BREAK</button>
        <button onClick={() => setTimeLongBreak()}>LONG BREAK</button>
      </div>
      <p style={{ fontSize: "72px" }}>{formatTime(state.currentTime)}</p>
      <div>
        <button onClick={() => play()}>PLAY</button>
        <button onClick={() => pause()}>PAUSE</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
}
