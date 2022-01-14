import { Html, useProgress } from "@react-three/drei";
import { useStore } from "../zustand/zStore";
import "../styles/fallback_loader.css";
import { useEffect } from "react";

export function GameLoader() {
  const l = ["l", "o", "a", "d", "i", "n", "g"];
  const { progress, item } = useProgress();
  const setLoaded = useStore((s) => s.setLoaded);

  useEffect(() => {
    progress >= 100 && setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <Html>
      <section className="section_fallback">
        <h1 className="fallback">
          {progress.toFixed(1)}%{"   "}
          {l.map((letter, i) => (
            <span key={i} className={"fallback loader" + i}>
              {letter}
            </span>
          ))}
        </h1>
        <div className="fallback">
          now loading <span className="item">{item}</span>
        </div>
      </section>
    </Html>
  );
}
