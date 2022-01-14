import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import three from "three";

const name = (type: string, ext: string = "jpg") => `${type}.${ext}`;

const Scene = () => {
  const [colorMap, ambientOcclusionMap, displacementMap, roughMap, normalMap] =
    useTexture([
      name("Color"),
      name("ambientOcclusion"),
      name("Displacement"),
      name("Roughness"),
      name("Normal"),
    ]);

  return (
    <>
      <mesh>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <sphereBufferGeometry args={[1, 100, 100]} />
        <meshStandardMaterial
          displacementScale={0.2}
          map={colorMap}
          displacementMap={displacementMap}
          roughnessMap={roughMap}
          normalMap={normalMap}
          aoMap={ambientOcclusionMap}
          emissiveMap={ambientOcclusionMap}
          emissiveIntensity={0.1}
          emissive={new three.Color(0xff0000)}
        />
      </mesh>
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
}
