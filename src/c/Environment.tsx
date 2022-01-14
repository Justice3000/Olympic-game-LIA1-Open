import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef } from "react";
import { MirroredRepeatWrapping, BackSide } from "three";
import sky_texture from "../textures/sky.jpg";
import { useStore } from "../zustand/zStore";
import {
  SKY_MOVEMENT_RATE,
  ENVIRONMENT_EMISSIVE_COLOR,
  TERRAIN_SIZE,
} from "../app_config";

export function Environment() {
  return (
    <Suspense fallback={null}>
      <Sky />
    </Suspense>
  );
}

const Sky = () => {
  const texture = useTexture(sky_texture);
  const sky = useRef<any>();

  const pedro = useStore((p) => p.pedro);

  useLayoutEffect(() => {
    texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
    texture.repeat.set(2, 2);
    texture.anisotropy = 16;
  }, [texture]);

  useFrame((state, delta) => {
    sky.current.rotation.z -= (SKY_MOVEMENT_RATE / 100) * delta;
    sky.current.rotation.y -= (SKY_MOVEMENT_RATE / 100) * delta;
    sky.current.rotation.x += (SKY_MOVEMENT_RATE / 100) * delta;

    if (pedro.current) {
      sky.current.position.x = pedro.current.position.x;
      sky.current.position.z = pedro.current.position.z - 450;
    }
  });

  return (
    <>
      <mesh ref={sky} rotation={[0, 0, Math.PI]} position={[0, 0, 0]}>
        <hemisphereLight intensity={0.1}></hemisphereLight>
        <sphereGeometry
          attach="geometry"
          args={[TERRAIN_SIZE * 1.2, 10, 10]}
        ></sphereGeometry>
        <meshPhongMaterial
          emissive={ENVIRONMENT_EMISSIVE_COLOR}
          emissiveIntensity={0.0001}
          attach="material"
          map={texture}
          side={BackSide}
          transparent={false}
        />
      </mesh>
    </>
  );
};
