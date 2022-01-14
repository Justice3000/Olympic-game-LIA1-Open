import { useFrame } from "@react-three/fiber";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  GAME_SPEED_LEVEL_UP,
  TERRAIN_COLOR,
  TERRAIN_EMISSIVE_COLOR,
  TERRAIN_SIZE,
  TEXTURE_SIZE,
} from "../app_config";
import { data, useStore } from "../zustand/zStore";
import floor from "../textures/floor/floor.png";
import floor_emissive from "../textures/floor/floor_emissive_map.png";
import { useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";

export function TerrainModel() {
  const g_one = useRef<THREE.Mesh>(null);
  const g_two = useRef<THREE.Mesh>(null);
  const terrain = useRef<THREE.Mesh>(null);
  const terrain_secondary = useRef<THREE.Mesh>(null);

  const [intensity, setIntensity] = useState<number>(0);

  const pedro = useStore((state) => state.pedro);
  const gameOver = useStore((s) => s.gameOver);

  const texture = useTexture(floor);
  const texture_emissive_map = useTexture(floor_emissive);

  useLayoutEffect(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(TEXTURE_SIZE, TEXTURE_SIZE);
    texture.anisotropy = 16;

    texture_emissive_map.wrapS = texture_emissive_map.wrapT = RepeatWrapping;
    texture_emissive_map.repeat.set(TEXTURE_SIZE, TEXTURE_SIZE);
    texture_emissive_map.anisotropy = 16;
  }, [texture, texture_emissive_map]);

  const terrainCounter = useRef(1); // indicates which terrain number it is
  const lastTerrain = useRef(0); // indicates which terrain number it was

  useFrame((state, delta) => {
    if (gameOver) {
      terrainCounter.current = 1;
      lastTerrain.current = 0;
    }
    const setTerrainIntoNewPosition = (terrain_ref: any) => {
      terrain_ref!.current.position.z -= TERRAIN_SIZE * 2;
      lastTerrain.current = terrain_ref!.current.position.z;
    };

    if (!pedro.current) return;

    if (
      Math.round(pedro.current.position.z) +
        TERRAIN_SIZE * terrainCounter.current -
        10 >
      -10
    ) {
      return; //shorting here to prevent terrain from being created
    }

    if (terrainCounter.current > 0) {
      terrainCounter.current % 2 === 0 && setIntensity(intensity + 0.1);

      terrainCounter.current % 2 === 0
        ? setTerrainIntoNewPosition(g_two)
        : setTerrainIntoNewPosition(g_one);
      terrainCounter.current++;
      terrainCounter.current % 2 === 0 &&
        (data.gameSpeed += GAME_SPEED_LEVEL_UP);
      terrainCounter.current % 2 === 0 && (data.level += 1);
    }
  });

  return (
    <>
      <group ref={g_one} position={[0, -5, -TERRAIN_SIZE / 2]}>
        <mesh visible={true} rotation={[-Math.PI / 2, 0, 0]} ref={terrain}>
          <planeBufferGeometry
            attach="geometry"
            args={[TERRAIN_SIZE, TERRAIN_SIZE, 1, 1]}
          />
          <meshStandardMaterial
            color={TERRAIN_COLOR}
            emissiveMap={texture_emissive_map}
            emissive={TERRAIN_EMISSIVE_COLOR}
            emissiveIntensity={intensity}
            attach="material"
            map={texture}
            roughness={0}
            metalness={0.5}
          />
        </mesh>
      </group>
      <group ref={g_two} position={[0, -5, -TERRAIN_SIZE - TERRAIN_SIZE / 2]}>
        <mesh
          visible={true}
          rotation={[-Math.PI / 2, 0, 0]}
          ref={terrain_secondary}
        >
          <planeBufferGeometry
            attach="geometry"
            args={[TERRAIN_SIZE, TERRAIN_SIZE, 1, 1]}
          />
          <meshStandardMaterial
            color={TERRAIN_COLOR}
            emissiveMap={texture_emissive_map}
            emissive={TERRAIN_EMISSIVE_COLOR}
            emissiveIntensity={intensity}
            attach="material"
            map={texture}
            roughness={0}
            metalness={0.5}
          />
        </mesh>
      </group>
    </>
  );
}

export default function Terrain() {
  return (
    <>
      <TerrainModel />
    </>
  );
}
