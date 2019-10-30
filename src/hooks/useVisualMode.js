import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace) {
    if (replace) {
      history.pop();
      setHistory([...history, newMode])
    } else {
      setHistory([...history, newMode])
    }
    setMode(newMode);
  }

  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length -1])
    }
  }

  return { mode, transition, back };
};
 