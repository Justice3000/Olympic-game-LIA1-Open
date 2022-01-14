import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { data, useStore } from "../zustand/zStore";

export function Dots() {
  const dots = useRef<any>();

  const pedro = useStore((state) => state.pedro);

  useFrame((state, delta) => {
    dots.current!.rotation.z += delta * 0.02 * data.gameSpeed;
    if (!pedro.current) {
      return;
    }
    dots.current.position.x = 0;
    dots.current.position.z = pedro.current.position.z;
  });
  return (
    <>
      <Stars
        ref={dots}
        radius={400}
        depth={200}
        count={20000}
        factor={30}
        saturation={0.5}
        fade={true}
      />
    </>
  );
}
