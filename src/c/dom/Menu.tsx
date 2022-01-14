import {
  GAME_NAME,
  GAME_SPEED_START,
  MAIN_MENU_BACKGROUND_COLOR,
} from "../../app_config";
import "../../styles/menu.css";
import logo from "../../images/pedro.png";
import { data, useStore } from "../../zustand/zStore";

interface MenuProps {
  gameStarted: boolean;
  gameLoaded: boolean;
}

export function Menu({ gameStarted, gameLoaded }: MenuProps) {
  const gameOver = useStore((state) => state.gameOver);
  const pedro = useStore((state) => state.pedro);
  const camera = useStore((state) => state.camera);

  const tequila = useStore((s) => s.tequila);
  const music = useStore((s) => s.music);
  const setMusic = useStore((s) => s.setMusic);
  const setTequila = useStore((s) => s.setTequila);
  const setGameStarted = useStore((s) => s.setGameStarted);
  const setGameOver = useStore((s) => s.setGameOver);

  return (
    <div
      className={gameLoaded && !gameStarted ? `main_menu show ` : "main_menu"}
      style={{
        background: MAIN_MENU_BACKGROUND_COLOR,
      }}
    >
      <div
        className={
          gameLoaded && !gameStarted
            ? `column_container`
            : "column_container block_all"
        }
      >
        <div className="name_game ">{GAME_NAME}</div>
        <img alt="logo for the game" className="logo " src={logo} />

        <>
          {gameOver ? (
            <button
              onClick={() => {
                setGameStarted(true);
                pedro.current.position.set(0, 0, 0);
                data.gameSpeed = GAME_SPEED_START;
                data.level = 1;
                camera.current.rotation.y = 0;
                setGameOver(false);
              }}
              className={"play_button"}
            >
              RESTART
            </button>
          ) : (
            <button
              onClick={() => {
                setGameStarted(true);
                data.gameSpeed = GAME_SPEED_START;
                camera.current.rotation.y = 0;
              }}
              className={"play_button"}
            >
              PLAY
            </button>
          )}

          <label className={tequila ? "teq_label shake" : "teq_label"}>
            <input type="checkbox" onClick={() => setTequila(!tequila)}></input>
            I want tequila!
          </label>
          <label className={"teq_label"}>
            <input type="checkbox" onClick={() => setMusic(!music)}></input>I
            want music!
          </label>
        </>
      </div>
    </div>
  );
}
