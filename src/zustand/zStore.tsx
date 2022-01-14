import { createRef } from "react";
import create from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

const useStore = create<GameStoreZ>((set, get) => {
  return {
    set,
    get,
    tequila: false,
    gameOver: false,
    gameStarted: false,
    loaded: false,
    keyPressed: {
      left: false,
      right: false,
      up: false,
    },
    music: false,
    pedro: createRef(),
    camera: createRef(),
    star: createRef(),
    setGameOver: (gameOver) => set({ gameOver }),
    setGameStarted: (gameStarted) => set((state) => ({ gameStarted })),
    setLoaded: (loaded) => set((state) => ({ loaded })),
    setTequila: (tequila) => set((state) => ({ tequila })),
    setMusic: (music) => set((state) => ({ music })),
  };
});

//simple object for mutations
const data: dataType = {
  gameSpeed: 0,
  velocity: 0,
  targetSpeed: 0, //could be used to create acceleration with delta
  xy: 0,
  points: 0,
  level: 1,
};

mountStoreDevtool("STORE", useStore as any);

export { useStore, data };
