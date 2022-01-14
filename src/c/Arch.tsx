/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import { ORB_EMISSION_COLOR, TERRAIN_SIZE } from "../app_config";
import { useStore } from "../zustand/zStore";
import ao from "../textures/orbs/Metal_Mesh_008_ambientOcclusion.jpg";
import baseColor from "../textures/orbs/Metal_Mesh_008_basecolor.jpg";
import displacement from "../textures/orbs/Metal_Mesh_008_height.png";
import metal from "../textures/orbs/Metal_Mesh_008_metallic.jpg";
import normal from "../textures/orbs/Metal_Mesh_008_normal.jpg";
import opacity from "../textures/orbs/Metal_Mesh_008_opacity.jpg";
import roughness from "../textures/orbs/Metal_Mesh_008_roughness.jpg";

export function Arch() {
  const pedro = useStore((s) => s.pedro);
  const arches = useRef<any>();

  const orb1 = useRef<any>();
  const orb2 = useRef<any>();
  const orb3 = useRef<any>();
  const orb4 = useRef<any>();
  const orb5 = useRef<any>();
  const orb6 = useRef<any>();
  const orb7 = useRef<any>();
  const orb8 = useRef<any>();
  const orb9 = useRef<any>();

  const arch1 = useRef<any>();
  const arch2 = useRef<any>();
  const arch3 = useRef<any>();
  const arch4 = useRef<any>();
  const arch5 = useRef<any>();
  const arch6 = useRef<any>();
  const arch7 = useRef<any>();
  const arch8 = useRef<any>();
  const arch9 = useRef<any>();

  const ball1 = useRef<any>();
  const ball2 = useRef<any>();
  const ball3 = useRef<any>();
  const ball4 = useRef<any>();
  const ball5 = useRef<any>();
  const ball6 = useRef<any>();
  const ball7 = useRef<any>();
  const ball8 = useRef<any>();
  const ball9 = useRef<any>();

  const [
    aoMap,
    baseColorMap,
    displacementMap,
    metalMap,
    normalMap,
    opacityMap,
    roughnessMap,
  ] = useTexture([
    ao,
    baseColor,
    displacement,
    metal,
    normal,
    opacity,
    roughness,
  ]);

  useFrame((state, delta) => {
    if (!pedro.current) {
      return;
    }

    for (let i = 1; i <= 9; i++) {
      eval(`arch${i}.current.rotation.z += 0.00${i};`);
      eval(
        `arch${i}.current.rotation.z > Math.PI*2 && (arch${i}.current.rotation.z = 0);`
      );
      eval(`ball${i}.current.rotation.y += 0.0${i};`);
      eval(`ball${i}.current.rotation.x += 0.00${i};`);
    }
    arches.current.position.z = pedro.current.position.z + TERRAIN_SIZE - 100;
  });

  let arch_array = [];
  for (let i = 1; i <= 9; i++) {
    arch_array.push(
      <group ref={eval(`arch${i}`)} key={i}>
        <mesh position={[0, 0, -900 - i * 100]} rotation={[0, 0, Math.PI - i]}>
          <torusBufferGeometry args={[260, 10, 1, 40]} />
          <meshBasicMaterial fog={false} attach="material" color={0xffffff} />
        </mesh>
        <mesh ref={eval(`ball${i}`)} position={[0, 260, -900 - i * 100]}>
          <sphereGeometry attach="geometry" args={[30, 30, 30]} />
          {/* <meshBasicMaterial fog={false} attach="material" color={0xffffff} /> */}
          <meshStandardMaterial
            aoMap={aoMap}
            map={baseColorMap}
            displacementMap={displacementMap}
            metalnessMap={metalMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            alphaMap={opacityMap}
            alphaTest={0.05}
            emissiveIntensity={0.05}
            emissive={ORB_EMISSION_COLOR}
            emissiveMap={opacityMap}
          />
        </mesh>

        <mesh ref={eval(`orb${i}`)} position={[0, 260, -900 - i * 100]}>
          <sphereBufferGeometry attach="geometry" args={[20, 20, 20]} />
          <meshStandardMaterial
            emissiveIntensity={10}
            emissiveMap={metalMap}
            emissive={ORB_EMISSION_COLOR}
          />
        </mesh>
      </group>
    );
  }

  return (
    <>
      <group ref={arches}>{arch_array}</group>
    </>
  );
}
