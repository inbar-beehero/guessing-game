import { useEffect, useRef, useState } from "react";
import {
  CHANNEL_NAME,
  flattenTerms,
  pickRandomUnused,
  toTeamState,
} from "../lib/selection.js";

export default function PlayerPage() {
  const [terms, setTerms] = useState([]);
  const [usedIds, setUsedIds] = useState(() => new Set());
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState("");
  const channelRef = useRef(null);
  const payloadRef = useRef(toTeamState(null, false));

  const exhausted = terms.length > 0 && usedIds.size >= terms.length;
  payloadRef.current = toTeamState(current, exhausted);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.type === "request") {
        channel.postMessage(payloadRef.current);
      }
    };
    return () => {
      channel.close();
      if (channelRef.current === channel) {
        channelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/terms.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("load");
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        const flat = flattenTerms(data);
        const first = pickRandomUnused(flat, new Set());
        setTerms(flat);
        setCurrent(first);
        setUsedIds(new Set(first ? [first.id] : []));
      })
      .catch(() => {
        if (!cancelled) {
          setError("לא ניתן לטעון את המונחים");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!current) {
      return;
    }
    channelRef.current?.postMessage(payloadRef.current);
  }, [current, exhausted]);

  function onNext() {
    const next = pickRandomUnused(terms, usedIds);
    if (!next) {
      return;
    }
    const nextUsed = new Set(usedIds);
    nextUsed.add(next.id);
    setUsedIds(nextUsed);
    setCurrent(next);
  }

  return (
    <div className="screen" style={{ background: current?.color ?? "#111827" }}>
      <div className="stage">
        <div className="stack">
          {error ? <p className="status">{error}</p> : null}
          {!error && !current ? <p className="status">טוען מונחים</p> : null}
          {current ? <h1 className="term">{current.text}</h1> : null}
          {current && exhausted ? <p className="notice">נגמרו כל המונחים</p> : null}
        </div>
      </div>
      <div className="actions">
        <button
          className="next"
          type="button"
          onClick={onNext}
          disabled={!current || exhausted || Boolean(error)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
