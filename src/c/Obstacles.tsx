import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useLayoutEffect } from "react";
import { Object3D, RepeatWrapping } from "three";
import {
  FREE_REAL_ESTATE,
  LEFT_WALL,
  OBSTACLES_HEIGHT,
  OBSTACLES_QT,
  OBSTACLE_EMISSIVE_COLOR,
  RIGHT_WALL,
  TERRAIN_SIZE,
  WALL_RADIUS,
} from "../app_config";
import { useStore } from "../zustand/zStore";
import { getDistance, randomWithinRange } from "./functions";
import secret_map from "../textures/obstacles/secret.png";
import earth from "../textures/obstacles/json.png";
import { useTexture } from "@react-three/drei";

export function Obstacles() {
  const texture_map = useTexture(secret_map);
  const texture = useTexture(earth);
  const obstacle_ref = useRef<any>(null);
  const material_ref = useRef<THREE.MeshBasicMaterial>(null);
  const gameOver_flag = useStore((s) => s.gameOver);
  const gameOver = useStore((s) => s.setGameOver);
  const gameStarted = useStore((s) => s.setGameStarted);

  const pedro = useStore((state) => state.pedro);
  const loaded = useStore((s) => s.loaded);

  const obstacle3D = useMemo(() => new Object3D(), []);

  const obstacles = useMemo(() => {
    if (!loaded) return [{ x: 0, y: 0, z: 0, rotate: 2.6 }]; //render only when loaded, otherwise why abuse Suspend?
    const obstacle_coords_bank = [];
    if (!gameOver_flag) {
      for (let index = 0; index < OBSTACLES_QT; index++) {
        // putting obstacles CLOSE to walls
        const x = randomWithinRange(
          LEFT_WALL + WALL_RADIUS / 2,
          RIGHT_WALL - WALL_RADIUS / 2
        );
        const y = 0;
        const z = -FREE_REAL_ESTATE + randomWithinRange(-400, 400); //steps between obstacles

        const rotate = randomWithinRange(-2.6, 2.6);

        obstacle_coords_bank.push({ x, y, z, rotate });
      }
    }
    return obstacle_coords_bank;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver_flag]);

  useFrame((state, delta) => {
    if (!pedro.current) {
      return;
    }
    obstacles.forEach((o, i) => {
      //GAME OVER LOGIC HERE
      if (o.z - pedro.current.position.z > -15) {
        if (
          o.x - pedro.current.position.x > -15 ||
          o.x - pedro.current.position.x < 15
        ) {
          const distance_to_pedro = getDistance(
            pedro.current.position.x,
            pedro.current.position.z,
            o.x,
            o.z
          );
          if (distance_to_pedro < 11) {
            gameOver(true);
            gameStarted(false);
          }
          //game over action
        }
      }
      //GAME OVER LOGIC ENDS HERE

      //HERE I JUST RANDOMIZE ALREADY EXISTING COORDINATES
      if (o.z - pedro.current.position.z > 15) {
        o.z =
          pedro.current.position.z -
          TERRAIN_SIZE +
          randomWithinRange(-400, 400); //variating obstacle z position
        o.y = -OBSTACLES_HEIGHT; // PUTTING OBSTACLES UNDER THE TERRAIN
        o.x = randomWithinRange(
          LEFT_WALL + WALL_RADIUS / 2,
          RIGHT_WALL - WALL_RADIUS / 2
        ); // putting obstacles CLOSE to walls
      }

      // make OBSTACLES grow when in sight
      if (o.y < OBSTACLES_HEIGHT / 2) {
        o.y + delta * 100 > OBSTACLES_HEIGHT / 2
          ? (o.y = OBSTACLES_HEIGHT / 2)
          : (o.y += delta * 100);
      }

      obstacle3D.position.set(o.x, o.y, o.z);

      obstacle3D.rotation.y = o.rotate;

      obstacle3D.updateMatrix();

      obstacle_ref.current.setMatrixAt(i, obstacle3D.matrix);
    });
    gameOver_flag
      ? (obstacle_ref.current.position.y -= 0.1)
      : (obstacle_ref.current.position.y = 0); //making obstacles drown slowly

    obstacle_ref.current.instanceMatrix.needsUpdate = true;
  });

  useLayoutEffect(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.anisotropy = 16;
  }, [texture]);

  return (
    <instancedMesh
      ref={obstacle_ref}
      args={[undefined, undefined, OBSTACLES_QT]}
    >
      <cylinderBufferGeometry
        args={[
          OBSTACLES_HEIGHT / 2,
          OBSTACLES_HEIGHT / 2,
          OBSTACLES_HEIGHT * 2,
          32,
        ]}
      />

      <meshStandardMaterial
        ref={material_ref}
        attach="material"
        emissive={OBSTACLE_EMISSIVE_COLOR}
        emissiveIntensity={0.005}
        emissiveMap={texture_map}
        map={texture}
        roughnessMap={texture}
        color="white"
        wireframe={gameOver_flag ? true : false}
      />
    </instancedMesh>
  );
}
