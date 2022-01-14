type keyPressed = { left: boolean; right: boolean; up: boolean };
type GameStoreZ = {
  set: (state: SetState<GameStoreZ>) => void;
  get: (state: GetState<GameStoreZ>) => void;
  pedro: React.RefObject<any>;
  camera: React.RefObject<any>;
  star: React.RefObject<any>;
  gameOver: boolean;
  gameStarted: boolean;
  loaded: boolean;
  tequila: boolean;
  music: boolean;
  keyPressed: keyPressed;
  setMusic: (music: boolean) => void;
  setTequila: (tequila: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setGameStarted: (gameStarted: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
};
type dataType = {
  gameSpeed: number;
  velocity: number;
  targetSpeed: number;
  xy: number;
  points: number;
  level: number;
};
