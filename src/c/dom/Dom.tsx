import { useStore } from "../../zustand/zStore";
import { HUD } from "./HUD";
import { Menu } from "./Menu";

export function Dom() {
  const gameStarted = useStore((s) => s.gameStarted);
  const gameLoaded = useStore((s) => s.loaded);

  return (
    <>
      <div className="wtf">
        <Menu gameStarted={gameStarted} gameLoaded={gameLoaded} />
        <HUD gameStarted={gameStarted} />
      </div>
    </>
  );
}
