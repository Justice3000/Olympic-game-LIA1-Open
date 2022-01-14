//imported components
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Stats, Preload, CameraShake } from "@react-three/drei";
//import { Environment } from "@react-three/drei";
import PostProcessing from "./c/PostProcessing";

//components
import { Dom } from "./c/dom/Dom";
import { Controls } from "./c/Controls";
import { Mist } from "./c/Mist";
import Terrain from "./c/Terrain";
import Pedro from "./c/Pedro";
import Walls from "./c/Walls";
import { Arch } from "./c/Arch";
import { Earth } from "./c/Earth";
import { Dots } from "./c/Dots";
import { Obstacles } from "./c/Obstacles";
import { GameLoader } from "./c/GameLoader";
import { useStore } from "./zustand/zStore";
import Music from "./c/Music";
import { Environment } from "./c/Environment"; // old environmental solution

function App() {
  const tequila = useStore((s) => s.tequila); //fetching tequila state/ a boolean that tells if we want to shake camera or not
  const gameOver = useStore((s) => s.gameOver); // game over boolean
  return (
    <>
      <Canvas
        style={{ zIndex: 1 }}
        gl={{ antialias: false, alpha: false }}
        mode="concurrent"
        dpr={window.devicePixelRatio}
      >
        <Suspense fallback={<GameLoader />}>
          <Music />
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 3, 3]} />
          {gameOver ? <Mist /> : null}
          <Stats />
          {gameOver ? null : <Terrain />}
          <Walls />
          <Pedro />
          <Obstacles />
          <Earth />
          <Dots />
          <Arch />
          <Environment />
          {tequila ? <CameraShake intensity={1} /> : null}
          <Preload all />
          <PostProcessing />
        </Suspense>
      </Canvas>
      <Dom />
      <Controls />
    </>
  );
}

export default App;
