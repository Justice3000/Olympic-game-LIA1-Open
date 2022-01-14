import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import "../../styles/hud.css";
import { data } from "../../zustand/zStore";

interface HUD_Props {
  gameStarted: boolean;
}

const retrievePoints = () => data.points;
const retrieveVelocity = () => data.velocity;
const retrieveLevel = () => data.level;

export function HUD({ gameStarted }: HUD_Props) {
  const point_ref = useRef<HTMLDivElement>(null);
  const velocity_ref = useRef<HTMLDivElement>(null);
  const level_ref = useRef<HTMLDivElement>(null!);
  let currentPoints = retrievePoints();
  let currentVelocity = retrieveVelocity();
  let currentLevel = retrieveLevel();

  //addEffect from fiber -- Adds a global callback which is called each frame
  useEffect(() =>
    addEffect(() => {
      //UPDATES ARE BEING MADE ONLY WHEN CHANGES ARE BEING DETECTED
      if (point_ref.current && velocity_ref.current) {
        point_ref.current.innerHTML !==
          retrievePoints().toFixed(0).toString() &&
          (point_ref.current.innerText = retrievePoints()
            .toFixed(0)
            .toString());

        velocity_ref.current.innerText !== retrieveVelocity().toString() &&
          (velocity_ref.current.innerText = retrieveVelocity()
            .toString()
            .substr(0, 5));
      }

      level_ref.current.innerText !== retrieveLevel().toString() &&
        (level_ref.current.innerText = retrieveLevel().toString());
    })
  );

  return (
    <div className={gameStarted ? "hud_container show" : "hud_container"}>
      <div>
        points:
        <span ref={point_ref}>{currentPoints}</span>
      </div>
      <div className="current_level">
        Level:
        <span ref={level_ref}>{currentLevel}</span>
      </div>

      <div className="hud_velocity">
        cosmic speed: <span ref={velocity_ref}>{currentVelocity}</span>
      </div>
    </div>
  );
}
