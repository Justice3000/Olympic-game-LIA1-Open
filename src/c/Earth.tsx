import { useStore } from "../zustand/zStore";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EARTH_EMISSION_COLOR, TERRAIN_SIZE } from "../app_config";
import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";
import color from "../textures/earth/color.jpg";
import displacement from "../textures/earth/roughness.jpg";
import clouds_color from "../textures/earth/clouds.jpg";
import clouds_displacement from "../textures/earth/cloud_displacement.jpg";

export function Earth() {
  const star = useStore((s) => s.star);
  const pedro = useStore((s) => s.pedro);
  const clouds = useRef<any>();
  const [color_map, displacement_map, c_color, c_displacement] = useTexture([
    color,
    displacement,
    clouds_color,
    clouds_displacement,
  ]);

  const earth_color = useMemo(() => EARTH_EMISSION_COLOR, []);

  useFrame((state, delta) => {
    if (pedro.current) {
      star.current!.position.z = pedro.current!.position.z - TERRAIN_SIZE - 300;
      star.current!.position.x = 0; //pedro.current!.position.x; //TO move star with pedro
    }

    star.current!.rotation.y += delta * 0.1;
    star.current!.rotation.x += delta * 0.2;
    clouds.current!.rotation.y -= delta * 0.1;
  });

  return (
    <group ref={star} position={[0, 0, -TERRAIN_SIZE]} rotation={[0.5, 5, 0]}>
      <mesh>
        <sphereGeometry attach="geometry" args={[350, 40, 40]} />
        <meshPhongMaterial
          attach="material"
          emissive={earth_color}
          emissiveIntensity={0.1}
          map={color_map}
          displacementMap={displacement_map}
          displacementScale={2}
          reflectivity={0}
          emissiveMap={displacement_map}
        />
      </mesh>
      <mesh ref={clouds}>
        <sphereGeometry attach="geometry" args={[360, 40, 40]} />
        <meshPhongMaterial
          attach="material"
          map={c_color}
          depthWrite={true}
          alphaMap={c_color}
          alphaTest={0.5}
          opacity={0.8}
          transparent={true}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}
