import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MIST_COLOR } from "../app_config";

export const Mist = () => {
  const mist = useRef<any>(null!);

  useFrame(() => {
    mist.current.near = 100;
    mist.current.far = 1800;
    mist.current.color = MIST_COLOR;
  });

  return <fog ref={mist} attach="fog" />;
};
