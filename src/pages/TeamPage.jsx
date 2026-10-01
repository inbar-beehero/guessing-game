import { useEffect, useState } from "react";
import { CHANNEL_NAME } from "../lib/selection.js";

export default function TeamPage() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === "state") {
        setState(event.data);
      }
    };
    channel.postMessage({ type: "request" });
    return () => channel.close();
  }, []);

  const background = state?.hasTerm ? state.color : "#111827";

  return (
    <div className="screen" style={{ background }}>
      <div className="stage">
        {state?.hasTerm ? (
          <div className="stack">
            <p className="label">קטגוריה</p>
            <h1 className="value">{state.categoryName}</h1>
            <p className="label count-label">מספר מילים</p>
            <p className="value">{state.wordCount}</p>
          </div>
        ) : (
          <p className="status">ממתינים לשחקן</p>
        )}
      </div>
    </div>
  );
}
