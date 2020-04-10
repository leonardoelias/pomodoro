import React from "react";

const DEFAULT_SECONDS_FOCUS = 1500;
const DEFAULT_SECONDS_SHORT_BREAK = 300;
const DEFAULT_SECONDS_LONG_BREAK = 900;

const PLAY = "PLAY";
const PAUSE = "PAUSE";
const RESET = "RESET";

const TYPE_FOCUS = "FOCUS";
const TYPE_SHORT_BREAK = "SHORT_BREAK";
const TYPE_LONG_BREAK = "LONG_BREAK";

const RUNNING_TIME = "RUNNING_TIME";

export function formatTime(seconds) {
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);
  const timeFormated = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  return timeFormated;
}

function pomodoroReducer(state, action) {
  switch (action.type) {
    case PLAY: {
      return {
        ...state,
        status: PLAY
      };
    }
    case PAUSE: {
      return {
        ...state,
        status: PAUSE
      };
    }
    case RESET: {
      return {
        ...state,
        currentTime: action.currentTimeType,
        status: PAUSE
      };
    }
    case RUNNING_TIME: {
      return {
        ...state,
        currentTime: state.currentTime - 1
      };
    }
    case TYPE_FOCUS: {
      return {
        ...state,
        currentTime: DEFAULT_SECONDS_FOCUS,
        status: PAUSE,
        type: TYPE_FOCUS
      };
    }
    case TYPE_SHORT_BREAK: {
      return {
        ...state,
        currentTime: DEFAULT_SECONDS_SHORT_BREAK,
        status: PAUSE,
        type: TYPE_SHORT_BREAK
      };
    }
    case TYPE_LONG_BREAK: {
      return {
        ...state,
        currentTime: DEFAULT_SECONDS_LONG_BREAK,
        status: PAUSE,
        type: TYPE_LONG_BREAK
      };
    }
    default: {
      throw new Error(`💣 Booom : ${action.type}`);
    }
  }
}

const initialState = {
  status: PAUSE,
  type: TYPE_FOCUS,
  currentTime: DEFAULT_SECONDS_FOCUS
};

const usePomodoro = () => {
  const [state, dispatch] = React.useReducer(pomodoroReducer, initialState);

  const getCurrentType = currentType =>
    ({
      FOCUS: DEFAULT_SECONDS_FOCUS,
      SHORT_BREAK: DEFAULT_SECONDS_SHORT_BREAK,
      LONG_BREAK: DEFAULT_SECONDS_LONG_BREAK
    }[currentType]);

  const play = React.useCallback(() => {
    dispatch({ type: PLAY });
  }, []);

  const pause = React.useCallback(() => {
    dispatch({ type: PAUSE });
  }, []);

  const reset = React.useCallback(() => {
    dispatch({ type: RESET, currentTimeType: getCurrentType(state.type) });
  }, [state.type]);

  const setTimeFocus = React.useCallback(() => {
    dispatch({ type: TYPE_FOCUS });
  }, []);

  const setTimeShortBreak = React.useCallback(() => {
    dispatch({ type: TYPE_SHORT_BREAK });
  }, []);

  const setTimeLongBreak = React.useCallback(() => {
    dispatch({ type: TYPE_LONG_BREAK });
  }, []);

  React.useEffect(() => {
    const idInterval = setInterval(tick, 1000);

    if (state.status !== PLAY) {
      clearInterval(idInterval);
    }

    function tick() {
      if (state.currentTime === 0) {
        pause();
        clearInterval(idInterval);
        return;
      }
      if (state.status === PLAY) {
        dispatch({ type: RUNNING_TIME });
      }
    }

    return () => {
      clearInterval(idInterval);
    };
  }, [state.status, state.currentTime, pause]);

  return [
    state,
    {
      play,
      pause,
      reset,
      setTimeFocus,
      setTimeShortBreak,
      setTimeLongBreak
    }
  ];
};

export default usePomodoro;
