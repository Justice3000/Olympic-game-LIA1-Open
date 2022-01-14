import { Cone } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { useStore } from "../zustand/zStore";
import {
  TERRAIN_SIZE,
  LEFT_WALL,
  RIGHT_WALL,
  WALL_RADIUS,
  WALL_COLOR,
} from "../app_config";

export default function Walls() {
  const pedro = useStore((s) => s.pedro);
  const gameOver = useStore((s) => s.setGameOver);
  const gameStarted = useStore((s) => s.setGameStarted);
  const rightWall = useRef<THREE.Mesh>(null!);
  const leftWall = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (!pedro.current) {
      return;
    }

    rightWall.current!.position.z = pedro.current.position.z;
    leftWall.current!.position.z = pedro.current.position.z;

    //
    if (
      leftWall.current!.position.x + WALL_RADIUS / 2 >
        pedro.current.position.x ||
      rightWall.current!.position.x - WALL_RADIUS / 2 < pedro.current.position.x
    ) {
      gameOver(true);
      gameStarted(false);
    }
  });

  return (
    <>
      <Cone
        args={[WALL_RADIUS, TERRAIN_SIZE * 2, 8]}
        ref={leftWall}
        position={[LEFT_WALL, -10, 0]}
        rotation={[Math.PI / 2, 0, Math.PI]}
      >
        <meshStandardMaterial attach="material" color={WALL_COLOR} />
      </Cone>
      <Cone
        args={[WALL_RADIUS, TERRAIN_SIZE * 2, 8]}
        ref={rightWall}
        position={[RIGHT_WALL, -10, 0]}
        rotation={[Math.PI / 2, 0, Math.PI]}
      >
        <meshStandardMaterial attach="material" color={WALL_COLOR} />
      </Cone>
    </>
  );
}
